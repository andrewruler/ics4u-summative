import "./components.css";

function Info() {
  return (
    <>
      <div className="reasons to join">
        <h1>Reasons to join Cineflix</h1>
        <div className="reasons to join-list">
          <div className="reason1">
            <h1>1. Safe</h1>
            <p>
              Cineflix is safe. Cineflix provides you with the latest movies and
              tv shows. It also provides you with the latest news and
              information.
            </p>
            <img src="src/assets/images/safe.png" alt="safe"></img>
          </div>
          <div className="reason2">
            <h1>2. Fast</h1>
            <p>
              Cineflix is fast. Cineflix provides you with the latest movies and
              tv shows. It also provides you with the latest news and
              information.
            </p>
            <img src="src/assets/images/fast.png" alt="fast"></img>
          </div>
          <div className="reason3">
            <h1>3. Reliable</h1>
            <p>
              Cineflix is reliable. Cineflix provides you with the latest movies
              and tv shows. It also provides you with the latest news and
              information.
            </p>
            <img src="src/assets/images/reliable.png" alt="reliable"></img>
          </div>
          <div className="reason4">
            <h1>4. User-friendly</h1>
            <p>
              Cineflix is user-friendly. Cineflix provides you with the latest
              movies and tv shows. It also provides you with the latest news and
              information.
            </p>
            <img src="src/assets/images/userfriendly.png" alt="user-friendly"></img>
          </div>
        </div>
      </div>
      <div className="frequently asked questions">
        <h1>Frequently Asked Questions</h1>
        <div className="question-container">
          <div className="question">
            <h1>Q: What is Cineflix?</h1>
          </div>
          <div className="answer">
            <p>
              A: Cineflix is a website that provides you with the latest movies
              and tv shows. It also provides you with the latest news and
              information.
            </p>
          </div>
        </div>
        <div className="question-container">
          <div className="question">
            <h1>Q: How does Cineflix work?</h1>
          </div>
          <div className="answer">
            <p>
              A: Cineflix works by providing you with the latest movies and tv
              shows. It also provides you with the latest news and information.{" "}
            </p>
          </div>
        </div>
        <div className="question-container">
          <div className="question">
            <h1>Q: What are the features of Cineflix?</h1>
          </div>
          <div className="answer">
            <p>
              A: Cineflix provides you with the latest movies and tv shows. It
              also provides you with the latest news and information.{" "}
            </p>
          </div>
        </div>
        <div className="question-container">
          <div className="question">
            <h1>Q: Is Cineflix safe?</h1>
          </div>
          <div className="answer">
            <p>
              A: Cineflix is safe. Cineflix provides you with the latest movies
              and tv shows. It also provides you with the latest news and
              information.{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Info;
