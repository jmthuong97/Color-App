import React, { Component } from 'react';
import axios from "../../../axios";
import { Button, Dropdown } from 'semantic-ui-react'
import { Row, Col, Card, CardHeader } from "reactstrap";

import GroupInformation from "./GroupInformation";
import ManageMembers from "./ManageMembers";
import CreateGroup from "./CreateGroup";

class GroupManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accessToken: '',
            groupsOption: [],
            datamembers: [],
            groupInfo: {},
            isCreateGroupPopup: false,
            numPage: 1,
            page: 1
        }
        this.toggleCreateGroupPopup = this.toggleCreateGroupPopup.bind(this);
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
                this.setState({ accessToken: cookies.accessToken })
                clearInterval(checkerID)
            }
        }, 1000)
        this.getGroupOption() // 
    }

    // Cập nhật thông tin nhóm trong dropdown
    getGroupOption = async () => {
        await axios.get("/groups")
            .then(groups => this.setState({ groupsOption: groups.data }))
            .catch(err => console.log(err))
    }

    // Lấy thông tin thành viên trong nhóm
    getDataMembers = async (id, page) => {
        await axios.get(`/${id}/${page}/${this.state.accessToken}`)
            .then(res => {
                let group = res.data.group
                let size = group.size % 50 === 0 ? Math.floor((group.size / 50)) : Math.floor(((group.size / 50) + 1))
                this.setState({
                    datamembers: res.data.members,
                    groupInfo: group,
                    numPage: size
                })
            })
            .catch(err => console.log(err))
    }

    // Cập nhật sau khi xóa nhóm
    updateGroupOption = () => {
        this.getGroupOption()
        this.setState({ groupInfo: {} })
    }

    // update data members sau khi xóa thành viên
    updateDataMembers = () => {
        if (this.state.groupInfo.id) {
            this.getDataMembers(this.state.groupInfo.id, this.state.page)
        }
    }

    // Sự kiện khi dropdown thay đổi giá trị
    handleChangeOption = async (e, data) => {
        await this.setState({ page: 1 })
        this.getDataMembers(data.value, this.state.page)
    }

    // popup tạo nhóm mới
    toggleCreateGroupPopup() {
        this.setState({
            isCreateGroupPopup: !this.state.isCreateGroupPopup,
        });
    }

    setPage = (page) => {
        if (this.state.groupInfo.id) {
            this.setState({ page })
            this.setState({ datamembers: [] })
            this.getDataMembers(this.state.groupInfo.id, page)
        }
    }

    render() {

        const { groupsOption, groupInfo, datamembers, accessToken } = this.state

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card style={{ marginBottom: '5px' }}>
                            <CardHeader>
                                <b>Chọn nhóm mà bạn muốn quản lý:</b>
                                <Dropdown placeholder='Chọn nhóm'
                                    search
                                    selection
                                    options={groupsOption}
                                    loading={groupsOption.length ? false : true}
                                    onChange={this.handleChangeOption}
                                    style={{ marginLeft: '10px' }} />
                                <Button basic
                                    color="green"
                                    floated='right'
                                    size='mini'
                                    onClick={this.toggleCreateGroupPopup} >Tạo nhóm mới
                                </Button>
                                <CreateGroup
                                    isCreateGroupPopup={this.state.isCreateGroupPopup}
                                    toggleCreateGroupPopup={this.toggleCreateGroupPopup}
                                    updateGroupOption={this.getGroupOption}>
                                </CreateGroup>
                            </CardHeader>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" lg="7">
                        <ManageMembers datamembers={datamembers}
                            currentGroupId={groupInfo.id}
                            updateDataMembers={this.updateDataMembers}
                            numPage={this.state.numPage}
                            page={this.state.page}
                            setPage={this.setPage}
                            accessToken={accessToken}>
                        </ManageMembers>
                    </Col>
                    <Col xs="12" lg="5">
                        <GroupInformation groupInfo={groupInfo}
                            updateGroupOption={this.updateGroupOption}>
                        </GroupInformation>
                    </Col>
                </Row>
            </div >
        );
    }
}

export default GroupManager;