import { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-api";

class MapContainer extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        style={{ width: "100%", height: "50%" }}
        zoom={10}
        initialCenter={{
          lat: 28.70406,
          lng: 77.102493,
        }}
      />
    );
  }
}
