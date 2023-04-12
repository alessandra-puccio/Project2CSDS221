import React from 'react';
import './style.css';
import React from 'react';
import * as React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import moment from 'moment';

export default function App() {
  //Array of tasks
  const [arrayTask, setArrayTask] = React.useState([]);

  //Attributes of each task
  const [task, setTask] = React.useState({
    title: '',
    description: '',
    deadline: moment(),
    priority: '',
    complete: false,
  });

  const [open, setOpen] = React.useState(false);

  // Whether or not task is being added
  const [adding, setAdding] = React.useState(false);
  const addItem = () => {
    setOpen(true);
    deleteFields();
    setAdding(true);
    openDialog();
  };

  // EDITING TITLE
  let editTitle = (e) => {
    setTask(Object.assign({}, task, { title: e.target.value }));
  };

  // EDITING DESCRPTION
  let editDescription = (e) => {
    setTask(Object.assign({}, task, { description: e.target.value }));
  };

  // delete all fields in dialog pop up
  const deleteFields = () => {
    setTask({
      title: '',
      description: '',
      deadline: '',
      priority: '',
    });
  };

  const displaySuccess = () => {
    toastr.success('Task added', '', {
      positionClass: 'toast-bottom-right',
    });
  };

  const displayDelete = () => {
    toastr.success('Task deleted', '', {
      positionClass: 'toast-bottom-right',
    });
  };

  const displayUpdate = () => {
    toastr.success('Task updated', '', {
      positionClass: 'toast-bottom-right',
    });
  };

  // Validating and erroring titles/descriptions
  const [titleValidator, setTitleValidator] = React.useState('');
  const [descriptionValidator, setDescriptionValidator] = React.useState('');
  const [titleError, setTitleError] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState(false);

  // Whether or not to display dialog (based on whether or not task is being added)
  const [displayDialog, setDisplayDialog] = React.useState(false);

  const openDialog = () => {
    setDisplayDialog(true);
  };

  // Closes dialog / removes errors
  const handleClose = () => {
    setDisplayDialog(false);
    setTitleValidator('');
    setDescriptionValidator('');
    setTitleError(false);
    setDescriptionError(false);
  };

  //handle edit -- EDIT THIS
  const handleEdit = () => {
    if (validateDescription()) {
      return;
    } else {
      let indexToFind = currentIndex;
      console.log(indexToFind);
      let temp = [...arrayTask];
      let targetTask = temp[indexToFind];
      console.log(targetTask);
      temp[indexToFind] = {
        title: targetTask.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        complete: targetTask.complete,
      };
      setArrayTask(temp);
      handleClose();
      deleteFields();
      displayUpdate();
    }
  };

  const clear = () => {
    setTask({
      title: '',
      description: '',
      deadline: moment(),
      priority: '',
    });
  };

  // shows dialog for edit pressed
  const openUpdateDialog = (index) => {
    setAdding(false);
    setCurrentIndex(index);
    openDialog();
    let targetTask = arrayTask[index];
    setTask({
      title: targetTask.title,
      description: targetTask.description,
      deadline: targetTask.deadline,
      priority: targetTask.priority,
    });
  };

  // Box UI
  const addOrEditBox = (addOrEdit) => {
    if (addOrEdit) {
      return (
        <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
          <AddCircleIcon fontSize="small" />
          Add Task
        </DialogTitle>
      );
    } else {
      return (
        <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
          <EditIcon fontSize="small" />
          Edit
        </DialogTitle>
      );
    }
  };

  // Handle when the user presses add or edit at bottom of pane
  const addOrEditButtons = (adding) => {
    if (adding) {
      return (
        <Button
          sx={{ bgcolor: 'primary.dark', width: '30%' }}
          onClick={() => addPressed()}
          variant="contained"
        >
          <AddCircleIcon fontSize="small" />
          &nbsp;Add
        </Button>
      );
    } else {
      return (
        <Button
          sx={{ bgcolor: 'primary.dark', width: '20%' }}
          onClick={handleEdit}
          variant="contained"
        >
          <EditIcon fontSize="small" />
          Edit
        </Button>
      );
    }
  };

  // handle add
  function addPressed() {
    validateDescription(); //check for error
    if (validateTitle() || validateDescription() || task.priority === '') {
      return;
    } else {
      setArrayTask((arrayTask) => [...arrayTask, task]); // add to task list
      clear();
      handleClose(); //close window
      displaySuccess(); //display success
    }
  }

  // check if description is empty
  let validateDescription = () => {
    let valDescription = task.description;
    let error = false;

    if (valDescription == '') {
      setDescriptionValidator('Description required');
      error = true;
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
      setDescriptionValidator('');
    }

    return error;
  };

  // check if title is empty/duplicate
  let validateTitle = () => {
    let valTitle = task.title;
    let error = false;
    // Empty
    if (valTitle == '') {
      setTitleValidator('Title required.');
      error = true;
      setTitleError(true);
    } else {
      setTitleError(false);
      setTitleValidator('');
    }
    // Duplicate
    for (let i = 0; i < arrayTask.length; i++) {
      if (valTitle === arrayTask[i].title) {
        setTitleValidator('Duplicate title.');
        error = true;
        setTitleError(true);
        return error;
      }
    }
    return error;
  };

  //  update button is hidden on check
  const handleBoxCheck = (index) => (e) => {
    let newArr = Array.from(arrayTask);
    let targetTask= newArr[index];
    let boxChecked = targetTask.complete;
    newArr[index] = {
      title: targetTask.title,
      description: targetTask.description,
      deadline: targetTask.deadline,
      priority: targetTask.priority,
      complete: !boxChecked,
    };
    setArrayTask(newArr);
  };

  const deleteTask= (index) => {
    let newArrs = arrayTask.slice();
    newArrs.splice(index, 1);
    setArrayTask(newArrs);
    displayDelete();
  };

  //store index inorder to update the correct task
  const [currentIndex, setCurrentIndex] = React.useState(-1);

  return (
    <div>
      <CardHeader
        sx={{ color: 'white', backgroundColor: 'primary.dark' }}
        title={
          <div
            style={{
              align: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MenuIcon sx={{ fontSize: '40px', alignItems: 'center' }} />
            <span style={{ marginLeft: '10px' }}>FRAMEWORKS</span>
          </div>
        }
        style={{ textAlign: 'center' }}
        action={
          <div>
            <Button
              variant="contained"
              onClick={() => {
                addItem();
              }}
              sx={{ marginRight: '10px', width: 125 }}
            >
              <AddCircleIcon sx={{ width: 23 }} />
              ADD
            </Button>
          </div>
        }
      ></CardHeader>

      <Dialog open={displayDialog} onClose={handleClose}>
        {addOrEditBox(adding)}

        {/* Pop up box content */}

        <DialogContent>
          <br />
          {adding && (
            <TextField
              error={titleError}
              label="Title"
              value={task.title}
              helperText={titleValidator}
              sx={{ width: '100%' }}
              onChange={(e) => editTitle(e)}
            />
          )}
          {/*Description*/}
          {adding ? (
            <div>
              <br />
            </div>
          ) : (
            <div>
              <br />
            </div>
          )}
          <TextField
            error={descriptionError}
            label="Description"
            helperText={descriptionValidator}
            value={task.description}
            sx={{ width: '100%' }}
            onChange={(e) => editDescription(e)}
          />
          <br /> <br />
          {/*Date */}
          <TextField
            type="date"
            fullWidth
            label="Deadline"
            value={task.deadline}
            defaultValue={moment()}
            onChange={function (e) {
              setTask(Object.assign({}, task, { deadline: e.target.value }));
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {/*high low med*/}
          <FormControl>
            <br />
            <FormLabel>Priority</FormLabel>
            <RadioGroup
              row
              value={task.priority}
              onChange={function (e) {
                const updatedTask= { ...task };
                updatedTask.priority = e.target.value;
                setTask(updatedTask);
              }}
            >
              <FormControlLabel value="low" control={<Radio />} label="Low" />
              <FormControlLabel value="med" control={<Radio />} label="Med" />
              <FormControlLabel value="high" control={<Radio />} label="High" />
            </RadioGroup>
          </FormControl>
        </DialogContent>

        {/* buttons at bottom add/edit */}
        <DialogActions>
          {/* calls function that sets up add/edit bottom button depending on whether we are in add/edit dialog*/}
          {addOrEditButtons(adding)}

          {/* CANCEL BUTTON AT BOTTOM */}
          <Button
            sx={{ bgcolor: 'red', width: '30%' }}
            onClick={handleClose}
            variant="contained"
          >
            <DoNotDisturbAltIcon fontSize="small" />
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ color: 'gray' }}>
                Title
              </TableCell>
              <TableCell align="center" sx={{ color: 'gray' }}>
                Description
              </TableCell>
              <TableCell align="center" sx={{ color: 'gray' }}>
                Deadline
              </TableCell>
              <TableCell align="center" sx={{ color: 'gray' }}>
                Priority
              </TableCell>
              <TableCell align="center" sx={{ color: 'gray' }}>
                Is Complete
              </TableCell>
              <TableCell align="center" sx={{ color: 'gray' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          {/* ENTRY ROWS */}

          {/* EDIT THE TABLE. BODY MORE. */}

          <TableBody>
            {arrayTask.map((task, index) => (
              <TableRow key={task.title}>
                <TableCell align="center">{task.title}</TableCell>
                <TableCell align="center">{task.description}</TableCell>
                <TableCell align="center">
                  {moment(task.deadline).format('MM/DD/YY')}
                </TableCell>
                <TableCell align="center">{task.priority}</TableCell>
                <TableCell align="center">
                  <Checkbox onChange={handleBoxCheck(index)} />
                </TableCell>
                <TableCell align="center">
                  <div>
                    {/*UPDATE(display if not checked) and DELETE BUTTONS*/}
                    {!task.complete && (
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => openUpdateDialog(index)}
                          sx={{ width: '80%' }}
                        >
                          <EditIcon fontSize="small" />
                          &nbsp;Update
                        </Button>
                      </div>
                    )}
                    <div>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => deleteTask(index)}
                        sx={{ bgcolor: 'red', width: '80%' }}
                      >
                        <CancelIcon fontSize="small" />
                        &nbsp;Delete
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
