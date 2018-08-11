import React, { Component } from 'react';
import axios from "../../../axios";
import { Checkbox, Button } from 'semantic-ui-react'
import { Modal, ModalBody, ModalFooter, ModalHeader, Col, CardBody, Form, FormGroup, Label, Input } from 'reactstrap';

class CreateGroup extends Component {

    state = {
        name: '',
        status: true,
        description: ''
    }

    handleChangeName = (e) => { this.setState({ name: e.target.value }) }
    handleChangeStatus = (e, data) => { this.setState({ status: data.checked }) }
    handleChangeDescription = (e) => { this.setState({ description: e.target.value }) }

    createGroup = async (e, value) => {
        this.props.toggleCreateGroupPopup()
        if (value.color === "green") {
            if (this.state.name.trim() === "") window.alert("Tên nhóm không được bỏ trống !")
            else {
                await axios.post("/newGroup", {
                    name: this.state.name,
                    status: this.state.status,
                    description: this.state.description
                })
                    .then(res => {
                        if (res.data) {
                            window.alert("Tạo nhóm mới thành công.")
                            this.props.updateGroupOption()
                        }
                        else window.alert("Tạo nhóm mới thất bại !")
                    })
            }
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.isCreateGroupPopup} toggle={this.props.toggleCreateGroupPopup}
                className={'modal-success ' + this.props.className}>
                <ModalHeader toggle={this.props.toggleCreateGroupPopup}>Tạo nhóm mới</ModalHeader>
                <ModalBody>
                    <CardBody>
                        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Tên nhóm</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="text" id="text-input" name="text-input" placeholder="Tên nhóm" value={this.state.name} onChange={this.handleChangeName} required />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label>Ngày tạo</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <p className="form-control-static">{new Date().toLocaleDateString()}</p>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="text-input">Trạng thái</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Checkbox toggle checked={this.state.status}
                                        label={this.state.status ? 'Đang hoạt động' : 'Dừng hoạt động'}
                                        onClick={this.handleChangeStatus} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md="3">
                                    <Label htmlFor="textarea-input">Miêu tả</Label>
                                </Col>
                                <Col xs="12" md="9">
                                    <Input type="textarea" name="textarea-input" id="textarea-input" rows="9" required
                                        placeholder="Miêu tả nhóm..." value={this.state.description} onChange={this.handleChangeDescription} />
                                </Col>
                            </FormGroup>
                        </Form>
                    </CardBody>
                </ModalBody>
                <ModalFooter>
                    <Button basic color="green" onClick={this.createGroup}>Tạo nhóm mới</Button>{' '}
                    <Button basic color="red" onClick={this.createGroup}>Thoát</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default CreateGroup;