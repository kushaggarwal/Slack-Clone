// import React from "react";
// import { Segment, Button, Input } from "semantic-ui-react";
// import firebase from "../../firebase";
// import FileModal from "./FileModal";
// import uuidv4 from "uuid/v4";
// class MessagesForm extends React.Component {
//   state = {
//     message: "",
//     loading: false,
//     channel: this.props.currentChannel,
//     user: this.props.currentUser,
//     errors: [],
//     percerntUploaded: 0,
//     modal: false,
//     uploadState: "",
//     uploadTask: null,
//     storageRef: firebase.storage().ref(),
//   };

//   openModal = () => {
//     this.setState({ modal: true });
//   };

//   closeModal = () => {
//     this.setState({ modal: false });
//   };

//   handleChange = (event) => {
//     this.setState({ [event.target.name]: event.target.value });
//   };

//   createMessage = (fileUrl = null) => {
//     const message = {
//       content: this.state.message,
//       timestamp: firebase.database.ServerValue.TIMESTAMP,
//       user: {
//         id: this.state.user.uid,
//         name: this.state.user.displayName,
//         avatar: this.state.user.photoURL,
//       },
//     };
//     if (fileUrl !== null) {
//       message["image"] = fileUrl;
//     } else {
//       message["content"] = this.state.message;
//     }
//     return message;
//   };

//   sendMessage = () => {
//     const { messagesRef } = this.props;
//     const { message, loading, channel, errors } = this.state;
//     if (message) {
//       this.setState({ loading: true });
//       messagesRef
//         .child(channel.id)
//         .push()
//         .set(this.createMessage())
//         .then(() => {
//           this.setState({ loading: false, message: "", errors: [] });
//         })
//         .catch((err) => {
//           console.error(err);
//           this.setState({
//             loading: false,
//             errors: errors.concat(err),
//           });
//         });
//     } else {
//       console.log("In error");
//       this.setState({
//         errors: errors.concat({ message: "Add a message" }),
//       });
//     }
//   };

//   uploadFile = (file, metadata) => {
//     const pathToUpload = this.state.channel.id;
//     const ref = this.props.messagesRef;
//     const filePath = `chat/public/${uuidv4()}.jpg`;
//     this.setState(
//       {
//         uploadState: "uploading",
//         uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
//       },
//       () => {
//         this.state.uploadTask.on(
//           "state-changed",
//           (snap) => {
//             const percerntUploaded = Math.round(
//               (snap.bytesTransferred / snap.totalBytes) * 100
//             );
//             this.setState({ percerntUploaded });
//           },
//           (err) => {
//             console.error(err);
//             this.setState({
//               errors: this.state.errors.concat(err),
//               uploadState: "error",
//               uploadTask: null,
//             });
//           },
//           () => {
//             this.state.uploadTask.snapshot.ref
//               .getDownloadedURL()
//               .then((downloadURL) => {
//                 this.sendFileMessage(downloadURL, ref, pathToUpload);
//               })
//               .catch((err) => {
//                 console.log(err);
//                 this.setState({
//                   errors: this.state.errors.concat(err),
//                   uploadState: "error",
//                   uploadTask: null,
//                 });
//               });
//           }
//         );
//       }
//     );
//   };

//   sendFileMessage = (fileUrl, ref, pathToUpload) => {
//     ref
//       .child(pathToUpload)
//       .push()
//       .set(this.createMessage(fileUrl))
//       .then(() => {
//         this.setState({ uploadState: "done" });
//       })
//       .catch((err) => {
//         console.log(err);
//         this.setState({ errors: this.state.errors.concat(err) });
//       });
//   };

//   render() {
//     const { errors, message, loading, modal } = this.state;
//     return (
//       <Segment className="messsageForm">
//         <Input
//           fluid
//           name="message"
//           onChange={this.handleChange}
//           style={{ marginBottom: "0.7em" }}
//           label={<Button icon={"add"} />}
//           value={message}
//           labelPosition="left"
//           className={
//             errors.some((error) => error.message.includes("message"))
//               ? "error"
//               : ""
//           }
//           placeholder="Write your message"
//         />
//         <Button.Group icon widths="2">
//           <Button
//             color="orange"
//             disabled={loading}
//             onClick={this.sendMessage}
//             content="Add Reply"
//             labelPosition="left"
//             icon="edit"
//           />
//           <Button
//             color="teal"
//             content="Upload Media"
//             labelPosition="right"
//             icon="cloud upload"
//             onClick={this.openModal}
//           />
//           <FileModal
//             uploadFile={this.uploadFile}
//             modal={modal}
//             closeModal={this.closeModal}
//           />
//         </Button.Group>
//       </Segment>
//     );
//   }
// }

// export default MessagesForm;

import React from "react";
import uuidv4 from "uuid/v4";
import firebase from "../../firebase";
import { Segment, Button, Input } from "semantic-ui-react";
import ProgressBar from "./ProgressBar";
import FileModal from "./FileModal";

class MessageForm extends React.Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadTask: null,
    uploadState: "",
    percentUploaded: 0,
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false,
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };

  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({ loading: true });
      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" }),
      });
    }
  };

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`;
    } else {
      return "chat/public";
    }
  };
  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/public/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.props.isProgressBarVisible(percentUploaded);
            this.setState({ percentUploaded });
          },
          (err) => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch((err) => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null,
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          errors: this.state.errors.concat(err),
        });
      });
  };

  render() {
    const { errors, message, loading, modal } = this.state;

    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          value={message}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          className={
            errors.some((error) => error.message.includes("message"))
              ? "error"
              : ""
          }
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            onClick={this.openModal}
            disabled={this.state.uploadState === "uploading"}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={this.state.uploadState}
          percentUploaded={this.state.percentUploaded}
        />
      </Segment>
    );
  }
}

export default MessageForm;
