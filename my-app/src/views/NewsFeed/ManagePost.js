import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

import GroupPost from './GroupPost';
import ControlPost from './ControlPost';

class ManagePost extends Component {

    state = {
        uid: '',
        accessToken: '',
        currentTrackData: ''
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
    
      componentDidMount() {
        const checkerID = setInterval(async () => {
          const cookies = this.parseDocumentCookie(document.cookie)
          const validToken = cookies.accessToken ? await this.isTokenValid(cookies.accessToken) : null
          if (cookies.accessToken && validToken) {
            this.setState({ uid: cookies.uid, accessToken: cookies.accessToken })
            clearInterval(checkerID)
          }
        }, 1000)
      }
    
      _onTrackData = (currentTrackData) => {
        this.setState({ currentTrackData });
      }

    render() {
        return (
            <div>
                <Row>
                    <Col xs="12" lg="6">
                        <GroupPost onTrackData={this._onTrackData} accessToken={this.state.accessToken} ></GroupPost>
                    </Col>
                    <Col xs="12" lg="6">
                        <ControlPost idPost={this.state.currentTrackData} accessToken={this.state.accessToken} ></ControlPost>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ManagePost;