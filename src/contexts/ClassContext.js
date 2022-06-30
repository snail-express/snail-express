import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const ClassContext = createContext();

export function useClass() {
  return useContext(ClassContext);
}

export function ClassProvider({ children }) {
  const [currentClass, setCurrentClass] = useState(null);
  const { currentUser } = useAuth();

  function isTutor() {
    return (
      currentClass &&
      (currentClass.headTutor.id === currentUser.uid ||
        currentClass.tutorIds.includes(currentUser.uid))
    );
  }

  async function changeClassName(className) {
    if (currentClass) {
      const classRef = doc(firestore, "classes", currentClass.id);
      return getDoc(classRef)
        .then((snapshot) => {
          return setDoc(classRef, { ...snapshot.data(), className: className });
        }).then(() => {
          setCurrentClass({...currentClass, className: className});
        }).catch((err) => {
          throw new Error(`Error setting class name: ${err}`);
        })
    }
  }
  const value = { currentClass, setCurrentClass, isTutor, changeClassName };
  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
}
