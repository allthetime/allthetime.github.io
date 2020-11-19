import React from 'react';
import './App.css';
import { about, at_post } from './data.json'
import ReactMarkdown from 'react-markdown'

const empty: string[] = [];

function App() {

  const [posts, setPosts] = React.useState(empty);

  function getPosts() {
    (async ()=> {
        let posts_:string[] = [];
        for (let i=1;i<=at_post;i++) {
            const filename = `00${i}`.substr(-3);
            const md = require(`./posts/${filename}.md`).default;
            const md_r = await fetch(md);
            const md_t: string = await md_r.text();
            posts_.push(md_t)
        }
        posts_.reverse()
        setPosts(posts_)
    })();
  }

  React.useEffect(getPosts,[])

  return (
    <div className="App">
        <span className="aboutText">{ about }</span>
        <div className="Posts">{
            posts && posts.map(p=>{
                return (
                    <div className="Post">
                        <div className="PostWrapper">
                            <ReactMarkdown children={p}/>
                        </div>
                    </div>
                )
            })
        }</div>
    </div>
  );
}

export default App;
