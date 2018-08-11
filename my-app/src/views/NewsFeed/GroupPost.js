import React, { Component } from 'react';
import Post from './Post';
import * as graph from '../../service/graph'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

class GroupPost extends Component {

    state = {
        posts: []
    }

    componentWillReceiveProps = async (props) => {
        let posts = await graph.getGroupData(props.accessToken);
        this.setState({ posts: posts.feed });
    }

    _onTrackData = (id) => {
        this.props.onTrackData(id)
    }

    render() {

        const { posts } = this.state

        return (
            <div style={{ marginLeft: '30px' }}>
                {posts.length ? (
                    posts.map((post, key) => <Post key={key} onTrackData={this._onTrackData} post={post}></Post>)
                ) : (
                        <Segment>
                            <Dimmer active inverted>
                                <Loader size='large'>Loading</Loader>
                            </Dimmer>
                            <Image src='https://semantic-ui.com/images/wireframe/paragraph.png' />
                        </Segment>
                    )}
            </div>
        );
    }
}

export default GroupPost;