import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class Modals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      show: props.show
    };
  }
  render() {
    console.log("In Modal");
    return (
      <Modal show={this.state.show}>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Modal body text goes here.</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary">Close</Button>
            <Button variant="primary">Save changes</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    );
  }
}

export default Modals;
