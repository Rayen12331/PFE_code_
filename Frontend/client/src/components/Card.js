import React, { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { Fragment, useState, useRef } from "react";


import { useEntryContext } from '../context/entry/entryState';
import {
  setTagFilter,
  removeEntry,
  setEditValues,
  toggleStarEntry,
  toggleViewEntry,
} from '../context/entry/entryReducer';
import TimeAgo from 'timeago-react';
import DeleteDialog from './DeleteDialog';
import entryService from '../services/entries';
import notify from '../utils/notifyDispatcher';

import {
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  Link,
  Chip,
  Button,
  IconButton,
  Divider,
  Tooltip,
} from '@material-ui/core';
import { useCardStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import LinkIcon from '@material-ui/icons/Link';
import WebIcon from '@material-ui/icons/Web';
import YouTubeIcon from '@material-ui/icons/YouTube';
import EditIcon from '@material-ui/icons/Edit';
import LineStyleIcon from '@material-ui/icons/LineStyle';
import styled from "styled-components";
import axios from 'axios';





const Container = styled.div`
  padding: 12px 14px;
  text-align: left;
  margin: 2px 0px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.09);
  &:hover {
    transition: all 0.6s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.5);
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSoft};
  flex: 7;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;



const OutlinedBox = styled.div`
  min-height: 34px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.soft2};
  color: ${({ theme }) => theme.soft2};
  ${({ button, theme }) =>
    button &&
    `
    user-select: none; 
  border: none;
  font-weight: 600;
  height: 38px;
    background: ${theme.soft};
    color:'${theme.soft2}';`}
  ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
  border: none;
  height: 38px;
    background: ${theme.primary};
    color: white;`}
  margin: 6px 0px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 0px 10px;
`;
const FlexDisplay = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: space-between;
`;



const Card = ({ entry }) => {
  const {
    id,
    title,
    link,
    tags,
    description,
    type,
    isViewed,
    isStarred,
    createdAt,
    updatedAt,
  } = entry;

  const [{ darkMode }, dispatch] = useEntryContext();
  const history = useHistory();  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useCardStyles(isViewed, darkMode)();

  //hooks for different steps of the work card
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectMember, setSelectMember] = useState(false);
  //the work card hook
  const [title1, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags1, setTags] = useState("");
  const [taskIndex, setTaskIndex] = useState(0);

  const token = localStorage.getItem("token");
  const [response, setResponse] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [newPort, setNewPort] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/change_port/${serviceName}/${newPort}?compose_path=${composePath}`,
        { compose_path: composePath }
      );
      setMessage4(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const [volumePath, setVolumePath] = useState("");

  const handleSubmit2 = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`/add_volume_to_compose/${volumePath}?compose_path=${composePath}`);
      setMessage2(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const [owner, setOwner] = useState('example_owner');
  const [repo, setRepo] = useState('example_repo');
  const [accessToken, setAccessToken] = useState('example_access_token');



  const handleSubmit3 = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/clone_repository',
        {
          owner,
          repo,
          access_token: accessToken,

        }

      );
      setMessage5(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  
  const goToAddTask = () => {
    
    setStep(step + 1);
  
};


  

  const [envName, setEnvName] = useState("");
  const [envValue, setEnvValue] = useState("");
  const [message, setMessage] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [message4, setMessage4] = useState("");
  const [message5, setMessage5] = useState("");

  const [task1, setTask] = useState([
    {
      task1: "",
      start_date: "",
      end_date: "",
      members: [],
    },
  ]);

  const handleSubmit4 = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`/add_env_to_compose/${envName}/${envValue}?compose_path=${composePath}`);
      setMessage3(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const [tag, setTag] = useState("");
  const [composePath, setComposePath] = useState("");

  const handleSubmit5 = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`/add_tag/${serviceName}/${tag}?compose_path=${composePath}`);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const [directoryPath, setDirectoryPath] = useState('');


  const handleRunDockerCompose = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`/rundockercompose?directory_path=${directoryPath}`);
      setResponse(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const [microservicePath, setMicroservicePath] = useState("");
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit6 = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`/build?microservice_path=${microservicePath}&command=${command}`);
      setOutput(response.data.output);
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while building the microservice.');
    }
  };

 









  const handleStarToggle = async () => {
    try {
      dispatch(toggleStarEntry(id));
      await entryService.star(id);
      notify(
        dispatch,
        `${isStarred ? 'Un-Starred' : 'Starred'} "${title}"!`,
        'success'
      );
    } catch (err) {
      if (err?.response?.data?.error) {
        notify(dispatch, `${err.response.data.error}`, 'error');
      } else {
        notify(dispatch, `${err.message}`, 'error');
      }
    }
  };

  const handleViewToggle = async () => {
    try {
      dispatch(toggleViewEntry(id));
      await entryService.view(id);
      notify(
        dispatch,
        `Marked "${title}" as ${isViewed ? 'Not Viewed' : 'Viewed'}!`,
        'success'
      );
    } catch (err) {
      if (err?.response?.data?.error) {
        notify(dispatch, `${err.response.data.error}`, 'error');
      } else {
        notify(dispatch, `${err.message}`, 'error');
      }
    }
  };

  const handleTagFilter = (tag) => {
    dispatch(setTagFilter(tag));
  };

  const handleEdit = () => {
    dispatch(setEditValues(entry));
    history.push('/add_update');
  };

  const handleDelete = async () => {
    try {
      dispatch(removeEntry(id));
      await entryService.remove(id);
      notify(dispatch, `Successfully deleted "${title}"!`, 'success');
    } catch (err) {
      if (err?.response?.data?.error) {
        notify(dispatch, `${err.response.data.error}`, 'error');
      } else {
        notify(dispatch, `${err.message}`, 'error');
      }
    }
  };

  const formattedLink = link.startsWith('http') ? link : `https://${link}`;
  const iconSize = isMobile ? 'small' : 'large';
  const iconStyle = { marginRight: 8 };

  return (
    <Paper className={classes.root} variant="outlined">
      <div className={classes.cardTitle}>
        <Typography variant="h5" className={classes.linkTitle}>
          {type === 'article' ? (
            <WebIcon style={iconStyle} fontSize={iconSize} />
          ) : type === 'video' ? (
            <YouTubeIcon style={iconStyle} fontSize={iconSize} />
          ) : (
            <LineStyleIcon style={iconStyle} fontSize={iconSize} />
          )}
          {title}
        </Typography>
        <div className={classes.endButtons}>
          {!isMobile ? (
            <>
              <Button
                onClick={handleEdit}
                startIcon={<EditIcon />}
                className={classes.edit}
              >
                Edit
              </Button>
              <DeleteDialog
                handleDelete={handleDelete}
                title={title}
                isMobile={isMobile}
              />
            </>
          ) : (
            <>
              <IconButton onClick={handleEdit} className={classes.edit}>
                <EditIcon />
              </IconButton>
              <DeleteDialog
                handleDelete={handleDelete}
                title={title}
                isMobile={isMobile}
              />
            </>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={isStarred}
                icon={<StarBorderIcon className={classes.starIcon} />}
                checkedIcon={<StarIcon className={classes.starIcon} />}
                className={classes.star}
              />
            }
            label={isMobile ? '' : isStarred ? 'Starred!' : 'Star it'}
            onChange={handleStarToggle}
            className={classes.starButton}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isViewed}
                icon={<VisibilityOutlinedIcon className={classes.viewIcon} />}
                checkedIcon={<VisibilityIcon className={classes.viewIcon} />}
                className={classes.view}
              />
            }
            label={isMobile ? '' : isViewed ? 'Viewed!' : 'Mark as viewed'}
            onChange={handleViewToggle}
            className={classes.viewButton}
          />
        </div>
      </div>
      <Divider />
      <div>
        <Link
          href={formattedLink}
          target="_blank"
          rel="noreferrer"
          variant="h6"
          color="secondary"
          className={classes.link}
        >
          <LinkIcon style={{ marginRight: 8 }} />
          {formattedLink.length > 40
            ? formattedLink.slice(0, 40) + '...'
            : formattedLink}
        </Link>
        <Typography varaint="body1" className={classes.description}>
          {description}
        </Typography>
        {tags.length !== 0 && (
          <div className={classes.tagsGroup}>
            Tags:{' '}
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                color="secondary"
                className={classes.tag}
                onClick={() => handleTagFilter(tag)}
              />
            ))}
          </div>
        )}
        <Typography variant="body2" className={classes.addedTime}>
          <Tooltip title={createdAt}>
            <span>
              Added:{' '}
              <TimeAgo datetime={createdAt} className={classes.timestamp} />
            </span>
          </Tooltip>
          {createdAt !== updatedAt ? (
            <Tooltip title={updatedAt}>
              <span>
                {' '}
                | Last modified:{' '}
                <TimeAgo
                  datetime={updatedAt}
                  className={classes.timestamp}
                />{' '}
              </span>
            </Tooltip>
          ) : null}
        </Typography>
      </div>
      <Container className={"item"}>
      {step === 0 && (
        <>
          <Top>
            <Title>Deploy your project</Title>
          </Top>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , marginBottom: '20px' }}>
  <form onSubmit={handleSubmit3} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Clone Repository</h2>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <label style={{ marginBottom: '10px' }}>
        Owner:
        <input
          type="text"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ marginBottom: '10px' }}>
        Repo:
        <input
          type="text"
          value={repo}
          onChange={(event) => setRepo(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ marginBottom: '10px' }}>
        Access Token:
        <input
          type="text"
          value={accessToken}
          onChange={(event) => setAccessToken(event.target.value)}
          style={{ marginLeft: '5px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none' }}>Clone Repository</button>
    </div>
    {message5 && (
        <p>{message5}</p>
      )}
  </form>
  
  
</div>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , marginBottom: '20px' }}>
  <form onSubmit={handleSubmit6} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Build your project</h2>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <label style={{ marginBottom: '10px' }}>
       Path:
      <input type="text" value={microservicePath} onChange={(e) => setMicroservicePath(e.target.value)} />

      </label>
      <label style={{ marginBottom: '10px' }}>
       Command:
      <input type="text" value={command} onChange={(e) => setCommand(e.target.value)} />

      </label>
      
      
      <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none' }}>Build</button>
    </div>
    {output && (
        <div>
          <h3>Build Output:</h3>
          <pre>{output}</pre>
        </div>
      )}

    

  </form> 
</div>
         
          
          <OutlinedBox
            button
            activeButton
            style={{ marginTop: "10px" }}
            onClick={() => goToAddTask()}
          >
            Change setting
          </OutlinedBox>
        </>
      )}
      {step === 1 && (
        <>
          <Top>
            <Title>Change settings </Title>
          </Top>
          {task1.map((task, index) => (
            <task>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , marginBottom: '20px'}}>
  <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Changing port</h2>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <label style={{ marginBottom: '10px' }}>
        Service:
        <input
          type="text"
          id="serviceName"
          value={serviceName}
          onChange={(event) => setServiceName(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ marginBottom: '10px' }}>
        New Port:
        <input
          type="number"
          value={newPort}
          onChange={(event) => setNewPort(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ marginBottom: '10px' }}>
        Compose Path:
        <input
          type="text"
          value={composePath}
          onChange={(event) => setComposePath(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      
      <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none' }}>Change port</button>
    </div>
    {message4 && (
        <p>{message4}</p>
      )}
  </form>
</div>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , marginBottom: '20px' }}>
  <form onSubmit={handleSubmit4} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Adding Environment</h2>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <label style={{ marginBottom: '10px' }}>
      Environment Name:
        <input
          type="text"
          value={envName}
          onChange={(event) => setEnvName(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ marginBottom: '10px' }}>
      Environment Value:
        <input
          type="text"
          value={envValue}
          onChange={(event) => setEnvValue(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ marginBottom: '10px' }}>
        Compose Path:
        <input
          type="text"
          value={composePath}
          onChange={(event) => setComposePath(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      
      
      <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none' }}>Add Environment</button>
    </div>
    {message3 && (
        <p>{message3}</p>
      )}
  </form>
</div>

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , marginBottom: '20px' }}>
  <form onSubmit={handleSubmit2} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Adding volume</h2>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <label style={{ marginBottom: '10px' }}>
      Volume:
        <input
          type="text"
          id="serviceName"
          value={volumePath}
          onChange={(event) => setVolumePath(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ marginBottom: '10px' }}>
        Compose Path:
        <input
          type="text"
          value={composePath}
          onChange={(event) => setComposePath(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      
      
      <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none' }}>Add Volume</button>
    </div>
    {message2 && (
        <p>{message2}</p>
      )}
  </form>
</div>

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , marginBottom: '20px'}}>
  <form onSubmit={handleSubmit5} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Adding Tag</h2>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <label style={{ marginBottom: '10px' }}>
      Service Name:
        <input
          type="text"
          value={serviceName}
          onChange={(event) => setServiceName(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ marginBottom: '10px' }}>
      Tag:
        <input
          type="text"
          value={tag}
          onChange={(event) => setTag(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <label style={{ marginBottom: '10px' }}>
        Compose Path:
        <input
          type="text"
          value={composePath}
          onChange={(event) => setComposePath(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none' }}>Add Tag</button>
    </div>
    {message && (
        <p>{message}</p>
      )}
  </form>
</div>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , marginBottom: '20px' }}>
  <form onSubmit={handleRunDockerCompose} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Deploy your project</h2>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

      <label style={{ marginBottom: '10px' }}>
        Directory Path:
        <input
          type="text"
          value={directoryPath}
          onChange={(event) => setDirectoryPath(event.target.value)}
          style={{ marginLeft: '21px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </label>
      
      
      <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none' }}>Deploy</button>
    </div>
    {response && (
        <p>{response}</p>
      )}
  </form>
  
</div>

          
                
             
              </task>

          ))}
         
         <FlexDisplay>
            <OutlinedBox
              button
              style={{ width: "100%" }}
              onClick={() => setStep(step - 1)}
            >
              Back
            </OutlinedBox>
            
            </FlexDisplay>

        </>
      )}
    </Container>
      
    </Paper>
  );
};

export default Card;
