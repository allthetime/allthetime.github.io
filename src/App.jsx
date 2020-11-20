import React, { useCallback } from 'react';
import './App.css';
import { about, at_post } from './data.json'
import ReactMarkdown from 'react-markdown'
import { DiscussionEmbed } from 'disqus-react';

import {
    BrowserRouter,
    HashRouter,
    Switch,
    Route,
    Link
  } from "react-router-dom";

type postObj = {
    md: string;
    filename: string;
}
type posts = postObj[];

const empty: posts = [];

function App() {

  const [posts, setPosts] = React.useState(empty);
  const [currentPost, setCurrentPost] = React.useState(null);

  const showComments = (filename:string) => {
      if (window.DISQUS) window.DISQUS.reset({
        reload: true,
        config: function () {  
          console.log(this);
          this.page.identifier = filename;  
          this.page.url = "https://allthetime.github.io/"+filename;
        }
      });           
      setCurrentPost(filename);
  }

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

  const Posts = (props)=>{
    const postObjects = posts.map((p,index)=>{
        const commentsEnabled = currentPost == p.filename;
        return (
            <div className="Post">
                <span className="fileName" id={p.filename}>{p.filename}</span>
                <div className="PostWrapper">
                    <ReactMarkdown className="ReactMarkdown" children={p.md}/>
                    {
                        !commentsEnabled && <button
                            onClick={()=>{
                                props.history.push('/'+p.filename)
                                showComments(p.filename);
                            }}
                        >
                            SHOW COMMENTS
                        </button>
                    }
                    { 
                        commentsEnabled && <DiscussionEmbed
                            shortname={'https-allthetime-github-io'}
                            config={
                                {
                                    url: "https://allthetime.github.io/"+p.filename,
                                    identifier: p.filename+"_0",
                                    title: p.filename,
                                }
                            }
                        />                
                    }
                </div>
            </div>
        )
      })

      return <div className="Posts">{ postObjects }</div>;
  }

  return (
    <div className="App">
        <span className="aboutText">{ about }</span>
        <BrowserRouter basename='/'>
            <Route path='/' component={Posts}/>
        </BrowserRouter>
    </div>
  );
}

export default App;
