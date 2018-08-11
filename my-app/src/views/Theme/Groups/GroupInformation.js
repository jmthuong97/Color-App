import React, { Component } from 'react';
import axios from "../../../axios";

import { Checkbox, Button } from 'semantic-ui-react'
import { Col, Card, CardHeader, CardBody, CardFooter, Modal, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";

class GroupInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groupInfo: {},
            name: '',
            status: true,
            description: '',
            isDeleteGroupPopup: false
        }
        this.toggleDeleteGroupPopup = this.toggleDeleteGroupPopup.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            groupInfo: props.groupInfo,
            name: props.groupInfo.name,
            status: props.groupInfo.status,
            description: props.groupInfo.description
        })
    }

    // sự kiện update thông tin nhóm
    updateGroupInfo = async (e) => {
        e.preventDefault();
        if (this.state.groupInfo.id) {
            if (this.state.name.trim() === "") window.alert("Tên nhóm không được bỏ trống !")
            else {
                await axios.put(`/${this.state.groupInfo.id}/group`, {
                    name: this.state.name,
                    status: this.state.status,
                    description: this.state.description
                })
                    .then(res => {
                        if (res.data) window.alert("Cập nhật thông tin nhóm thành công.")
                        else window.alert("Cập nhật thất bại !")
                    })
            }
        }
    }

    // sự kiện xóa nhóm
    deleteGroup = async (e, value) => {
        e.preventDefault();
        this.toggleDeleteGroupPopup()
        if (value.color === "red" && this.state.groupInfo.id) {
            await axios.delete(`/${this.state.groupInfo.id}/group`)
                .then(res => {
                    if (res.data) {
                        window.alert("Xóa nhóm " + this.state.name + " thành công.")
                        this.setState({
                            groupInfo: {},
                            name: '',
                            status: true,
                            description: ''
                        })
                        this.props.updateGroupOption()
                    }
                    else window.alert("Xóa nhóm " + this.state.name + " thất bại !")
                })
        }
    }

    handleChangeName = (e) => { this.setState({ name: e.target.value }) }
    handleChangeStatus = (e, data) => { this.setState({ status: data.checked }) }
    handleChangeDescription = (e) => { this.setState({ description: e.target.value }) }

    // popup xóa nhóm
    toggleDeleteGroupPopup() {
        if (this.state.groupInfo.id) {
            this.setState({
                isDeleteGroupPopup: !this.state.isDeleteGroupPopup,
            });
            //   this.getGroupOption()
        }
    }

    render() {

        const { groupInfo, name, status, description } = this.state

        return (
            <Card>
                <CardHeader>
                    <strong>Thông tin nhóm</strong>
                    <Button color='red' size='tiny' floated='right' onClick={this.toggleDeleteGroupPopup} circular>x</Button>
                    <Modal isOpen={this.state.isDeleteGroupPopup}
                        toggle={this.toggleDeleteGroupPopup}>
                        <ModalBody>
                            Bạn có chắc xóa nhóm <b>{this.state.name}</b> chứ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="red" onClick={this.deleteGroup}>Có</Button>
                            <Button color="green" onClick={this.deleteGroup}>Thôi</Button>
                        </ModalFooter>
                    </Modal>
                </CardHeader>
                <CardBody>
                    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="text-input">Tên nhóm</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input type="text"
                                    id="text-input"
                                    name="text-input"
                                    placeholder="Tên nhóm"
                                    value={name}
                                    required
                                    disabled={name ? false : true}
                                    onChange={this.handleChangeName} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label>Ngày tạo</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <p className="form-control-static">{groupInfo.createdAt}</p>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="text-input">Trạng thái</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Checkbox toggle
                                    checked={status}
                                    disabled={name ? false : true}
                                    label={status ? 'Đang hoạt động' : 'Dừng hoạt động'}
                                    onClick={this.handleChangeStatus} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="textarea-input">Miêu tả</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input type="textarea"
                                    name="textarea-input"
                                    id="textarea-input"
                                    placeholder="Miêu tả nhóm..."
                                    rows="9"
                                    value={description}
                                    required
                                    disabled={name ? false : true}
                                    onChange={this.handleChangeDescription} />
                            </Col>
                        </FormGroup>
                    </Form>
                </CardBody>
                <CardFooter>
                    <Button type="submit"
                        size="large"
                        color="blue"
                        onClick={this.updateGroupInfo}>Cập nhật</Button>
                </CardFooter>
            </Card>
        );
    }
}

export default GroupInformation;