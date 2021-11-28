import React, {useState, useEffect} from 'react'
import './App.css';
import Post from './Post';
import {auth, db} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle(){
    const top = 50;
    const left = 50;

    return {
      top: `${top}%` ,
      left: `${left}%` ,
      transform: `translate(-${top}%, -${left}%)`,
    };
}
const useStyles = makeStyles( (theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    /*transform: 'translate(-50%, -50%)',*/
  }
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  //useEffect: runs a piece of code based on a specific condition
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }

    })
    return () => {
      unsubscribe();
    }
  }, [user, username]);
  useEffect(() => {
    // this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        //this line acts like a camera, every time a new post is added, this code is fired
        setPosts(snapshot.docs.map (doc => ({
          id: doc.id,
          post: doc.data()
        })))
    })
  }, [] );

  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))
  } 

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="App">     
      <Modal 
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img
              className="app__headerImage1"
              src="https://i.ibb.co/mXgDg7b/logo.png"
              alt=""
            />
          </center>
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signUp}> Sign Up </Button>
        </form>
        
      </div>
      
      </Modal>
      
      <Modal 
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img
              className="app__headerImage1"
              src="https://i.ibb.co/mXgDg7b/logo.png"
              alt=""
            />
          </center>
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signIn}> Sign In</Button>
        </form>
        
      </div>
      
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          //src="https://logodix.com/logo/4284.png"
          //src="https://www.instagram.com/static/images/web/mobile_nav_type_log.png/735145cfe0a4.png"
          src="https://i.ibb.co/mXgDg7b/logo.png"
          alt=""
        />
        {user ? (
       <Button onClick={() => auth.signOut()}>Log out</Button> 
      ): (
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      )}
      </div>
      
      <div className="app__posts" >
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}></Post>
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
          /* url='https://www.instagram.com/p/CWku8imjDk6/' */
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            clientAccessToken='633142231463786|IGQVJXT1ZA6OS1EWjNDU09fTU41V3NPTE5vUEYyODItU2dNaHY5d0V5TXcyOEJUNUhiLVVuQ2t3U1RyUU9CMllPVE1vMjg2UVNJR2t1UmFiNktHRWZATY2hWcFBVV2R6SVMwN1AxeXExTjNxMzZARSDJGdAZDZD'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      

      {user?.displayName ? (
        <ImageUpload username= {user.displayName} />
      ):(
        <h3> Sorry you need to login to Upload</h3>
      )}
      
      {/* Header */}

      {/* Posts */}
      {/* Posts */}
    </div>
  );
}

export default App;
