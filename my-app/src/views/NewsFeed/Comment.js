import React, { Component } from 'react';
import { Header, Image, Table } from 'semantic-ui-react'
import * as postService from '../../service/post'

class Comment extends Component {

    render() {

        const user = this.props.user;
        const profileLink = "https://facebook.com/" + user.id;
        const subName = user.middle_name ? (user.last_name + user.middle_name) : user.last_name

        return (
            <Table.Row verticalAlign='middle'>
                <Table.Cell width='2' singleLine>
                    <Header as='h4' image>
                        <Image avatar src={user.picture.data.url} href={profileLink} target="_blank" rounded size='big' />
                        <Header.Content href={profileLink} target="_blank">
                            {user.first_name}
                            <Header.Subheader>{subName}</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell width='6'>{this.props.message}</Table.Cell>
                <Table.Cell width='2' textAlign='center'>{postService.getDateInVietnamese(this.props.createTime)}</Table.Cell>
            </Table.Row>
        );
    }
}

export default Comment;