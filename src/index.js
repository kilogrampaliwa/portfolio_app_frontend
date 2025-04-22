import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import headline from './lids-lang.json';

function LanguageSelector({ language, setLanguage }) {
  return (
    <div className="language-selector">
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="pl">Polski</option>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
        <option value="cat">Català</option>
      </select>
    </div>
  );
}

function Headline({ lang }) {
  const langContent = headline[lang];
  return (
    <div className='headline'>
      <h1>{langContent?.title || 'Brak tytułu'}</h1>
      <h3>{langContent?.headline || 'Brak opisu'}</h3>
    </div>
  );
}

function TenorBackground({ onLoaded }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tenor.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    const checkIframeLoaded = () => {
      const iframe = document.querySelector('.tenor-gif-embed iframe');
      if (iframe) {
        iframe.addEventListener('load', () => {
          onLoaded(); 
        });
      } else {
        setTimeout(checkIframeLoaded, 100);
      }
    };

    checkIframeLoaded();

    return () => {
      document.body.removeChild(script);
    };
  }, [onLoaded]);

  return (
    <div className="background-wrapper">
      <div
        className="tenor-gif-embed"
        data-postid="6506452466663437743"
        data-share-method="host"
        data-aspect-ratio="1.76596"
        data-width="100%"
      >
        <a href="https://tenor.com/view/space-wallpaper-stars-background-outerspace-blinking-stars-space-travel-gif-6506452466663437743">
          Space Wallpaper GIF
        </a>
      </div>
    </div>
  );
}

function TechnologyList() {
  const [language, setLanguage] = useState('en');
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch('/api/technologies/')
      .then(res => res.json())
      .then(data => {
        const updatedData = data.map(item => ({
          ...item,
          image: '/images/' + item.image
        }));
        setTableData(updatedData);
      });
  }, []);

  return (
    <>
      <TenorBackground onLoaded={() => setBackgroundReady(true)} />

      {!backgroundReady && (
        <div className="loading-overlay">
          <p>Ładowanie tła...</p>
        </div>
      )}

      {backgroundReady && (
        <>
          <LanguageSelector language={language} setLanguage={setLanguage} />
          <Headline lang={language} />
          <section className='technologylist'>
            {tableData.map((tech, index) => (
              <Technology
                key={index}
                technologyName={tech.name}
                aim={tech.aim}
                img={tech.image}
                progress={tech.progress}
              />
            ))}
          </section>
        </>
      )}
    </>
  );
}

const Technology = ({ technologyName, aim, img, progress }) => {
  if (progress)
    return (
      <article className='technology'>
        <img src={img} alt={technologyName} />
        <h2>{technologyName}</h2>
        <ProgressBar progress={progress} />
        <h4>{aim}</h4>
      </article>
    );
};

function ProgressBar({ progress }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const progressValue = Array.isArray(progress) ? progress[0] : progress;
  const direction = Array.isArray(progress) ? progress[1] : null;
  const emptyWidth = 100 - progressValue;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(progressValue);
    }, 100);
    return () => clearTimeout(timeout);
  }, [progressValue]);

  return (
    <div>
      <div className="progress-bar">
        <div
          className="progress-filled"
          style={{ width: `${animatedProgress}%` }}
        ></div>
        {direction && (
          <div
            className={`progress-animated ${direction === 'left' ? 'left' : 'right'}`}
            style={{ width: `${emptyWidth}%` }}
          ></div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TechnologyList />);
