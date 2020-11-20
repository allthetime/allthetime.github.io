import React from 'react';
import './App.css';
import { about, at_post } from './data.json'
import ReactMarkdown from 'react-markdown'

type postObj = {
    md: string;
    filename: string;
}
type posts = postObj[];

const empty: posts = [];

function App() {

  const [posts, setPosts] = React.useState(empty);

  function getPosts() {
    (async ()=> {
        let posts_:posts = [];
        for (let i=1;i<=at_post;i++) {
            const filename = `00${i}`.substr(-3);
            const md = require(`./posts/${filename}.md`).default;
            const md_r = await fetch(md);
            const md_t: string = await md_r.text();
            posts_.push({
                md: md_t,
                filename
            })
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
            posts && posts.map((p,index)=>{
                return (
                    <div className="Post">
                        <span className="fileName">{p.filename}</span>
                        <div className="PostWrapper">
                            <ReactMarkdown children={p.md}/>
                        </div>
                    </div>
                )
            })
        }</div>
    </div>
  );
}

export default App;
