import React, { useMemo, useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import {
  Button,
  Card,
  DropdownButton,
  Dropdown,
  ProgressBar,
  Spinner,
} from "react-bootstrap";

import {
  query,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  deleteDocs,
  where,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useClass, isTutor } from "../contexts/ClassContext";
import { firestore } from "../firebase";

const LiveFeedback = () => {
  const { currentClass } = useClass();
  const { currentUser } = useAuth();
  const [results, setResults] = useState([]);
  const [decoy, setDecoy] = useState(false);

  // Reset previous submission when user enter feedback page
  useEffect(() => {
    // ???
  }, [currentClass.id, currentUser.email]);

  const reactions = ["fast", "slow", "confusing", "good"];
  const variants = ["danger", "info", "warning", "success"];

  const resetResponseHandler = (event) => {
    event.preventDefault();
    const feedbackRef = collection(
        firestore,
        "classes",
        currentClass.id,
        "feedback"
      );
      const q = getDocs(feedbackRef).then((ss) =>
        ss.docs.map(d => {
          const newRef = doc(
            firestore,
            "classes",
            currentClass.id,
            "feedback", 
            d.id
          );
          deleteDoc(newRef).then(() => console.log("deleted" + d.id));
        })
      );
  }

  const pushFeedbackHandler = async (event, reaction) => {
    event.preventDefault();
    const current = new Date();
    const feedbackRef = collection(
      firestore,
      "classes",
      currentClass.id,
      "feedback"
    );
    setDoc(doc(feedbackRef, `${current.getTime()}`), {
      user: currentUser.email,
      reaction: reaction,
    });
    pullFeedback();
  };

  const pullFeedback = () => {
    const feedbackRef = collection(
      firestore,
      "classes",
      currentClass.id,
      "feedback"
    );
    const promises = reactions.map((reaction) => {
      const q = query(feedbackRef, where("reaction", "==", reaction));
      return getDocs(q).then((snapshot) => {
        return snapshot.docs.map((docSnapshot) => {
          return docSnapshot.data();
        });
      });
    });

    const counts = [];
    Promise.all(
      promises.map((promise) => promise.then((arr) => counts.push(arr.length)))
    ).then();
    const oldResults = [...results];
    setResults(counts);
    return counts;
  };

  const memoResults = useMemo(() => pullFeedback(), []);

  useEffect(() => {
    setTimeout(() => setDecoy(!decoy), 1000);
  }, [decoy]);

  return (
    <>
      <NavigationBar />
      <br></br>
      <Card
        className="d-flex align-items-center justify-content-center"
        style={{ maxWidth: "900px", margin: "auto" }}
      >
        <DropdownButton id="dropdown-basic-button" title="Submit feedback">
          {reactions.map((reaction) => {
            return (
              <Dropdown.Item
                onClick={(event) => pushFeedbackHandler(event, reaction)}
                key={reaction}
              >
                {reaction}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
        <br></br>
        <br></br>
        {results.length === reactions.length ? (
          reactions.map((x) => {
            const fraction =
              results.length == 0
                ? 0
                : Math.round(
                    (results[reactions.indexOf(x)] /
                      results.reduce((x, y) => x + y, 0)) *
                      100
                  );
            return (
              <div key={x}>
                <ProgressBar
                  style={{
                    minHeight: "30px",
                    minWidth: "400px",
                    maxWidth: "800px",
                  }}
                  animated
                  now={fraction}
                  label={`${fraction}%`}
                  variant={variants[reactions.indexOf(x)]}
                />
                <div className="fs-5">
                  {results[reactions.indexOf(x)] +
                    " out of " +
                    results.reduce((x, y) => x + y, 0) +
                    " find the lecture "}
                  <strong>{x}</strong>
                </div>
                <br></br>
              </div>
            );
          })
        ) : (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {/* {isTutor() ? <Button onClick={resetResponseHandler}>Reset responses</Button> : <div></div>} */}
      </Card>
    </>
  );
};

export default LiveFeedback;
