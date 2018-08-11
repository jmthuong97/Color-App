import React, { Component } from 'react';
import axios from "../../axios";
import { Segment, Table, Button, Dropdown } from 'semantic-ui-react'
import * as graph from '../../service/graph'
import * as dataMining from '../../service/dataMining'
import Comment from './Comment';

class ControlPost extends Component {

    state = {
        data: [],
        comments: [],
        groupsOption: []
    }

    async componentDidMount() {
        await axios.get("/groups")
            .then(groups => this.setState({ groupsOption: groups.data }))
            .catch(err => console.log(err))
    }

    componentWillReceiveProps = async (props) => {
        if (props.idPost) {
            let posts = await graph.getPostData(props.accessToken, props.idPost)
            if (posts.comments) {
                let comments = posts.comments.data;
                dataMining.changeTypeConfirm("5b6af74c04d5700014f87e69", comments, "confirm")
                this.setState({ comments });
            } else this.setState({ comments: [] });
        }
    }

    handleChangeOption = async (e, data) => {
        /*this.getGroupById(data.value)*/ console.log(data)
    }

    handleClick = async (e, data) => {
        console.log(data)
    }

    render() {
        const { comments, groupsOption } = this.state
        const listItem = comments.map((item, key) => <Comment key={key} user={item.from} message={item.message} createTime={item.created_time}></Comment>)

        return (
            <Segment style={{ marginRight: '3%', position: 'fixed' }}>
                <Button.Group floated='right'>
                    <Button color='green' value="confirm" onClick={this.handleClick}>Confirm</Button><Button.Or />
                    <Button color='orange' value="notconfirm" onClick={this.handleClick}>Chưa Confirm</Button><Button.Or />
                    <Button color='red' value="absent" onClick={this.handleClick}>Confirm vắng</Button>
                </Button.Group>
                <Dropdown placeholder='Chọn nhóm'
                    search
                    selection
                    options={groupsOption}
                    loading={groupsOption.length ? false : true}
                    onChange={this.handleChangeOption} />
                <Table color="green" key="green" size="large" columns='10' style={{ marginBottom: '0', borderBottom: '0' }}>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell width='2'>Member</Table.HeaderCell>
                            <Table.HeaderCell width='6'>Content</Table.HeaderCell>
                            <Table.HeaderCell width='2'>Create time</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                </Table>
                <Table size="large" columns='10' structured fixed striped compact='very' style={{ marginTop: '0' }}>
                    {comments.length ?
                        (<Table.Body style={{ display: 'table-caption', height: '40vh', borderLeft: '1px solid #e8e8e8', overflow: 'scroll', overflowX: 'hidden' }}>
                            {listItem}
                        </Table.Body>) :
                        (<Table.Body>
                            <Table.Row>
                                <Table.Cell colSpan='3' textAlign='center'>Không có dữ liệu</Table.Cell>
                            </Table.Row>
                        </Table.Body>)}
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='3'>

                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </Segment>
        );
    }
}

export default ControlPost;