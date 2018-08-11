import React, { Component } from 'react';
import axios from "../../../axios";
import * as graph from '../../../service/graph'
import { Dropdown, Table, Button, Menu } from 'semantic-ui-react'
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";

import Member from "./Member";


class ManageMembers extends Component {

    state = {
        membersOption: [],
        datamembers: [],
        value: []
    }

    async componentWillReceiveProps(props) {
        if (props.accessToken) {
            let membersOption = await graph.getAllMembers(props.accessToken);
            if (membersOption) this.setState({ membersOption })
            this.setState({
                datamembers: props.datamembers,
            })
        }
    }

    handleChange = (e, { value }) => this.setState({ value })
    // Thêm thành viên vào nhóm
    addMembersBtn = async () => {
        if (this.state.value && this.props.currentGroupId) {
            await axios.post(`/${this.props.currentGroupId}/addMember`, {
                members: JSON.stringify(this.state.value)
            }).then(res => {
                if (res.data) {
                    window.alert("Thêm thành viên thành công.")
                    this.setState({ value: [] })
                    this.updateDataMembers()
                }
                else window.alert("Thêm thành viên thất bại !")
            })
        }
    }

    updateDataMembers = () => {
        this.props.updateDataMembers()
    }

    handleClick = (currentPage, e) => {
        e.preventDefault()
        this.props.setPage(currentPage)
    }

    listPage = () => {
        if (this.props.numPage >= 2) {
            const output = [];
            for (let i = 1; i <= this.props.numPage; i++) {
                if (i === this.props.page) {
                    output.push(<Menu.Item key={i} active>{i}</Menu.Item>)
                } else output.push(<Menu.Item as='a' data={i} onClick={(e) => this.handleClick(i, e)}>{i}</Menu.Item>)
            }
            return output;
        }
    }

    render() {

        const { membersOption, datamembers } = this.state
        const listMembers = datamembers.map((member, key) =>
            <Member key={key} member={member}
                updateDataMembers={this.updateDataMembers}
                currentGroupId={this.props.currentGroupId}></Member>)

        return (
            <Card>
                <CardHeader>
                    <b>Quản lý nhóm</b>
                </CardHeader>
                <CardBody>
                    <Table color="green" key="green" columns='10' size="large" fixed style={{ marginBottom: '0', borderBottom: '0' }}>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell width='2'>Họ tên</Table.HeaderCell>
                                <Table.HeaderCell width='1'>Sinh nhật</Table.HeaderCell>
                                <Table.HeaderCell width='2'>Khóa</Table.HeaderCell>
                                <Table.HeaderCell width='2'>Địa chỉ</Table.HeaderCell>
                                <Table.HeaderCell width='2'>Số điện thoại</Table.HeaderCell>
                                <Table.HeaderCell width='1'></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                    </Table>
                    <Table columns='10' structured compact='very' style={{ marginTop: '0' }}>
                        <Table.Body style={{ display: 'table-caption', height: '40vh', borderLeft: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8', overflow: 'scroll', overflowX: 'hidden' }}>
                            {datamembers.length ? listMembers : (
                                <Table.Row>
                                    <Table.Cell colSpan='6' textAlign='center'>Không có dữ liệu</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    {this.listPage() ? (
                        <Menu pagination style={{ marginBottom: '20px' }}>
                            {this.listPage()}
                        </Menu>
                    ) : ''}
                    <Row>
                        <Col xs="12" lg="2" style={{ paddingRight: '0px' }}>
                            <Button color="green" size='small' style={{ width: '90%' }} onClick={this.addMembersBtn}>Thêm</Button>
                        </Col>
                        <Col xs="12" lg="10" style={{ paddingLeft: '0px' }}>
                            <Dropdown placeholder='Chọn thành viên'
                                multiple
                                search
                                selection
                                scrolling
                                fluid
                                value={this.state.value}
                                disabled={this.props.currentGroupId ? false : true}
                                loading={membersOption.length ? false : true}
                                onChange={this.handleChange}
                                options={membersOption} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

export default ManageMembers;