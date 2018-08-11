import React, { Component } from 'react';
import { Button, Card, Image, Segment, Label } from 'semantic-ui-react'
import Linkify from 'react-linkify'
import * as postService from '../../service/post'

const colors = [
    'red',
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink',
    'brown',
    'grey',
    'black',
]

class Post extends Component {

    trackData = (e) => {
        e.preventDefault()
        this.props.onTrackData(this.props.post.id)
    }

    render() {
        const post = this.props.post;

        const postLink = "https://facebook.com/" + post.id
        const profileLink = "https://facebook.com/" + post.from.id;
        const searchLink = (key) => ("https://www.facebook.com/search/str/" + key.substring(1, key.length) + "/keywords_search");
        const redirect = (address) => { window.open(address) }

        const postPhotos = post.type === 'photo' ? postService.extractPhotosFromPost(post) : '';

        return (
            post.message != null &&
            <div style={{ marginBottom: '30px' }}>
                <Card fluid raised image>
                    <Label attached='top'>{post.type}</Label>
                    <Segment basic style={{ marginTop: "0 !important" }} color={colors[Math.floor(Math.random() * colors.length)]}>
                        <Card.Content>
                            <Image floated='left' size='mini' src={post.from.avatar} onClick={() => redirect(profileLink)} circular />
                            <Button basic color='green' floated='right' onClick={this.trackData} >Track data</Button>
                            <Card.Header><a href={profileLink} target="_blank">{post.from.name}</a></Card.Header>
                            <Card.Meta><a href={postLink} target="_blank">{postService.getDateInVietnamese(post.created_time)}</a></Card.Meta>
                        </Card.Content>
                        <Card.Description style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
                            <Linkify properties={{ target: '_blank', style: { color: '#365899' } }}>
                                {post.message}
                            </Linkify>
                            {postService.getHashtags(post.message).length !== 0 &&
                                <div style={{ marginTop: '10px' }}>
                                    {postService.getHashtags(post.message).map((hashtag, key) =>
                                        (<Label as='a'
                                            tag
                                            key={key}
                                            style={{marginRight: '5px'}}
                                            color={colors[Math.floor(Math.random() * colors.length)]}
                                            onClick={() => redirect(searchLink(hashtag))}
                                            target="_blank">
                                            {hashtag}
                                        </Label>)
                                    )}
                                </div>}
                        </Card.Description>
                    </Segment>
                    {postPhotos.length ? (<Image src={postPhotos[0].src} href={postPhotos[0].url} target="_blank" fluid></Image>) : ''}
                </Card>
            </div>
        );
    }
}

export default Post;