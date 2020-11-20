import React, { useCallback } from 'react';
import './App.css';
import { about, at_post } from './data.json'
import ReactMarkdown from 'react-markdown'
import { DiscussionEmbed } from 'disqus-react';

type postObj = {
    md: string;
    filename: string;
}
type posts = postObj[];

const empty: posts = [];

function App() {

  const [posts, setPosts] = React.useState(empty);
  const [currentPost, setCurrentPost] = React.useState("001");

  const showComments = (filename:string) => {
      console.log('set '+filename)
    // window.DISQUS.reset({
    //     reload: true,
    //     config: function () {  
    //     console.log('THIS', this, this.page)
    //       this.page.identifier = filename;  
    //       this.page.url = "https://allthetime.github.io/#!"+filename;
    //     }
    //   });      
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

  const postObjects = posts.map((p,index)=>{
    return (
        <div className="Post">
            <span className="fileName" id={p.filename}>{p.filename}</span>
            <div className="PostWrapper">
                <ReactMarkdown children={p.md}/>
                <button
                    onClick={()=>{
                        showComments(p.filename);
                        setTimeout(()=>{
                            showComments(p.filename);
                        }, 500)
                    }}
                >
                    SHOW COMMENTS
                </button>
                { currentPost == p.filename &&  
                    <DiscussionEmbed
                        shortname={'https-allthetime-github-io'}
                        config={
                            {
                                url: "https://allthetime.github.io/#!"+p.filename,
                                identifier: p.filename,
                                title: p.filename,
                                language: 'english'
                            }
                        }
                    />                
                }
            </div>
        </div>
    )
  })

  return (
    <div className="App">
        <span className="aboutText">{ about }</span>
        <div className="Posts">{
            postObjects
        }</div>
    </div>
  );
}

export default App;
