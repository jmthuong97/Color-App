import React, { Component } from 'react';
import { Table, Header, Image, Button } from "semantic-ui-react";
import { Modal, ModalBody, ModalFooter } from "reactstrap"
import axios from "../../../axios";

class Member extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDeleteMemberPopup: false
        }
        this.toggleDeleteMemberPopup = this.toggleDeleteMemberPopup.bind(this);
    }

    // sự kiện xóa thành viên
    deleteGroup = async (e, value) => {
        e.preventDefault();
        this.toggleDeleteMemberPopup()
        if (value.color === "red" && this.props.member) {
            await axios.delete(`/${this.props.currentGroupId}/${this.props.member.id}`)
                .then(res => {
                    if (res.data) {
                        window.alert("Xóa thành viên " + this.props.member.fullname + " thành công !")
                        this.props.updateDataMembers()
                    } else window.alert("Xóa thành viên " + this.props.member.fullname + " thất bại !")
                })
        }
    }

    // popup xóa thành viên
    toggleDeleteMemberPopup() {
        this.setState({
            isDeleteMemberPopup: !this.state.isDeleteMemberPopup,
        });
    }

    render() {

        const member = this.props.member

        return (
            <Table.Row verticalAlign='middle' textAlign='center'>
                <Table.Cell width='2' textAlign='left'>
                    <Header as='h4' image>
                        <Image avatar src={member.avatar} href={member.link} target="_blank" rounded size='mini' />
                        <Header.Content href={member.link} target="_blank">
                            {member.name}
                            <Header.Subheader>{member.subname}</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell width='1'>{member.birthday ? member.birthday : 'Chưa có'}</Table.Cell>
                <Table.Cell width='2'>{member.course ? member.course : 'Chưa có'}</Table.Cell>
                <Table.Cell width='2'>{member.address ? member.address : 'Chưa có'}</Table.Cell>
                <Table.Cell width='2'>{member.numberPhone ? member.numberPhone : 'Chưa có'}</Table.Cell>
                <Table.Cell width='1'><Button basic color='red' size='mini' circular onClick={this.toggleDeleteMemberPopup}>Xóa</Button></Table.Cell>
                <Modal isOpen={this.state.isDeleteMemberPopup} toggle={this.toggleDeleteMemberPopup}
                    className='modal-lg '>
                    <ModalBody>
                        Bạn có chắc xóa thành viên <b>{member.fullname}</b> này chứ?
                  </ModalBody>
                    <ModalFooter>
                        <Button color="red" onClick={this.deleteGroup}>Có</Button>{' '}
                        <Button color="green" onClick={this.deleteGroup}>Thôi</Button>
                    </ModalFooter>
                </Modal>
            </Table.Row>
        );
    }
}

export default Member;