import { useCallback, useEffect, useState } from "react";
import { useClass } from "../contexts/ClassContext";
import firestore from "../firestore";
import ReactionBar from "../components/ReactionBar";

export default function Reply(props) {
  const {currentClass} = useClass();
  const { getUser } = firestore;
  const currentThread = props.thread;
  const currentPost = props.post;
  const currentReply = props.reply;
  const [author, setAuthor] = useState([]);

  const getUserGroup = useCallback((userId) => {
    if (userId && currentClass) {
      if (currentClass.studentIds.includes(userId)) {
        return "students";
      } else if (currentClass.tutorIds.includes(userId)) {
        return "tutors";
      } else if (currentClass.headTutor.id === userId) {
        return 'headTutor';
      } else {
        return null;
      }
    }
  }, [currentClass])

  const populateAuthor = useCallback(() => {
    if (currentClass && currentThread && currentReply) {
      const userGroup = getUserGroup(currentReply.authorId);
      if (!userGroup) {
        setAuthor({name: "[Deleted User]", role: 'Unknown role'});
      } else if (userGroup === 'headTutor') {
        setAuthor({...currentClass.headTutor, role: 'Head Tutor'});
      } else {
        getUser(currentClass.id, userGroup, currentReply.authorId)
          .then((user) => {
            setAuthor({...user, role: (userGroup === 'students' ? 'Student' : 'Tutor')});
          });
      }
    }
  }, [currentClass, currentThread, currentReply, getUserGroup, getUser]);

  useEffect(() => {
    populateAuthor();
  }, [populateAuthor]);

  return (
    <div className='d-flex gap-5'>
      <div className='vr'></div>
      <div className="flex-grow-1 rounded slate-700 text-slate-200">
        <div className='p-4'>
          <h4 className='d-flex gap-4'>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
            <span>{author.level !== undefined ? `Level ${author.level}` : ''}</span>
          </h4>      
          <p>{currentReply.body}</p>
        </div>
        <ReactionBar
          currentThread={currentThread}
          currentPost={currentPost}
          content={currentReply}
          contentType='reply'
          populatePosts={null}
        />
      </div>

    </div>
  );
}