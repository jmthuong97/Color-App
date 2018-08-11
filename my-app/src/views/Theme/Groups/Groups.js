import React, { Component } from 'react';
import axios from "../../../axios";
import * as graph from '../../../service/graph'
import { Dropdown, Table, Checkbox, Button } from 'semantic-ui-react'
import { Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, CardFooter, Modal, ModalBody, ModalFooter } from "reactstrap";

import DetailTable from "./DetailTable";
import CreateGroup from "./CreateGroup";

class Groups extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      groupsOption: [],
      membersOption: [],
      dataTable: [],
      groupInfo: {},
      name: '',
      status: true,
      description: '',
      isCreateGroupPopup: false,
      isDeleteGroupPopup: false
    }
    this.toggleCreateGroupPopup = this.toggleCreateGroupPopup.bind(this);
    this.toggleDeleteGroupPopup = this.toggleDeleteGroupPopup.bind(this);
  }

  parseDocumentCookie = (documentCookie) => {
    if (documentCookie === "") return {}
    const cookiesInString = documentCookie.split('; ')
    const cookies = {}
    cookiesInString.forEach(cookie => {
      const separatorIdx = cookie.indexOf('=')
      const firstHalf = cookie.slice(0, separatorIdx)
      const secondHalf = cookie.slice(separatorIdx + 1)
      cookies[firstHalf] = secondHalf
    })
    return cookies
  }

  isTokenValid = async (token) => {
    const response = await fetch(`https://graph.facebook.com/v2.10/me?access_token=${token}`)
    const json = await response.json()
    return !json.error
  }

  async componentDidMount() {
    const checkerID = setInterval(async () => {
      const cookies = this.parseDocumentCookie(document.cookie)
      const validToken = cookies.accessToken ? await this.isTokenValid(cookies.accessToken) : null
      if (cookies.accessToken && validToken) {
        let membersOption = await graph.getAllMembers(cookies.accessToken);
        if (membersOption) this.setState({ membersOption })
        this.setState({ accessToken: cookies.accessToken })
        clearInterval(checkerID)
      }
    }, 1000)
    this.getGroupOption() // 
  }

  handleChangeName = (e) => { this.setState({ name: e.target.value }) }
  handleChangeStatus = (e, data) => { this.setState({ status: data.checked }) }
  handleChangeDescription = (e) => { this.setState({ description: e.target.value }) }

  // get thông thông tin nhóm vào dropdown
  getGroupOption = async () => {
    await axios.get("/groups")
      .then(groups => this.setState({ groupsOption: groups.data }))
      .catch(err => console.log(err))
  }

  // sự kiện khi dropdown thay đổi giá trị
  handleChangeOption = async (e, data) => {
    await axios.get(`/${data.value}/${this.state.accessToken}`)
      .then(res => {
        let group = res.data.group
        console.log(res.data.group)
        this.setState({
          dataTable: res.data.members,
          groupInfo: group,
          name: group.name,
          status: group.status,
          description: group.description,
        })
      })
      .catch(err => console.log(err))
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
            console.log(res);
            console.log(res.data);
            if (res.data) window.alert("Cập nhật thông tin nhóm thành công.")
            else window.alert("Cập nhật thất bại !")
          })
      }
    }
  }

  // sự kiện xóa nhóm
  deleteGroup = async (e, value) => {
    e.preventDefault();

    if (value.color === "red") {
      if (this.state.groupInfo.id) {
        await axios.delete(`/${this.state.groupInfo.id}/group`)
          .then(res => {
            if (res.data) {
              window.alert("Xóa nhóm " + this.state.name + " thành công.")
              this.setState({
                dataTable: [],
                groupInfo: {},
                name: '',
                status: true,
                description: ''
              })
            }
            else window.alert("Xóa nhóm " + this.state.name + " thất bại !")
          })
      }
    }
    this.toggleDeleteGroupPopup()
  }

  // popup tạo nhóm mới
  toggleCreateGroupPopup() {
    this.setState({
      isCreateGroupPopup: !this.state.isCreateGroupPopup,
    });
    this.getGroupOption()
  }

  // popup xóa nhóm
  toggleDeleteGroupPopup() {
    if (this.state.groupInfo.id) {
      this.setState({
        isDeleteGroupPopup: !this.state.isDeleteGroupPopup,
      });
      this.getGroupOption()
    }
  }

  render() {

    const options = [
      { key: 'new', text: 'New', value: 'new' },
      { key: 'save', text: 'Save as...', value: 'save' },
      { key: 'edit', text: 'Edit', value: 'edit' },
    ]

    const DropdownExampleUpward = () => <Dropdown floating options={options} text='File' />

    const { groupsOption, membersOption, dataTable, groupInfo } = this.state
    const listMembers = dataTable.map((member, key) => <DetailTable key={key} member={member}></DetailTable>)

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card style={{ marginBottom: '5px' }}>
              <CardHeader>
                <b>Chọn nhóm mà bạn muốn quản lý:</b>
                <Dropdown placeholder='Chọn nhóm' search selection options={groupsOption} loading={groupsOption.length ? false : true} onChange={this.handleChangeOption} />
                <Button basic color="green" floated='right' size='mini' onClick={this.toggleCreateGroupPopup} >Tạo nhóm mới</Button>
                <CreateGroup isCreateGroupPopup={this.state.isCreateGroupPopup} toggleCreateGroupPopup={this.toggleCreateGroupPopup}></CreateGroup>
              </CardHeader>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="7">
            <div className="card">
              <div className="card-header">
                <b>Thành viên nhóm</b>
              </div>
              <div className="card-body">
                <div>
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
                      {dataTable.length ? listMembers : (
                        <Table.Row>
                          <Table.Cell colSpan='6' textAlign='center'>Không có dữ liệu</Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table>
                  <Row>
                    <Col xs="12" lg="2" style={{ paddingRight: '0px' }}><Button color="green" size='small' style={{ width: '90%' }}>Thêm</Button></Col>
                    <Col xs="12" lg="10" style={{ paddingLeft: '0px' }}>
                      <Dropdown placeholder='Select Friend'
                        multiple
                        search
                        selection
                        scrolling
                        fluid
                        options={membersOption} />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
          <Col xs="12" lg="5">
            <Card>
              <CardHeader>
                <strong>Thông tin nhóm</strong>
                {DropdownExampleUpward()}
                <Button basic color='red' floated='right' onClick={this.toggleDeleteGroupPopup} className="mr-1">Xóa</Button>
                <Modal isOpen={this.state.isDeleteGroupPopup} toggle={this.toggleDeleteGroupPopup}
                  className='modal-lg '>
                  <ModalBody>
                    Bạn có chắc xóa nhóm <b>{this.state.name}</b> chứ?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="red" onClick={this.deleteGroup}>Có</Button>{' '}
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
                      <Input type="text" id="text-input" name="text-input" placeholder="Tên nhóm" value={this.state.name} onChange={this.handleChangeName} required />
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
                      <Checkbox toggle checked={this.state.status}
                        label={groupInfo.status ? 'Đang hoạt động' : 'Dừng hoạt động'}
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
              <CardFooter>
                <Button type="submit" size="large" color="blue" onClick={this.updateGroupInfo}><i className="fa fa-dot-circle-o"></i> Cập nhật</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div >
    );
  }
}

export default Groups;
