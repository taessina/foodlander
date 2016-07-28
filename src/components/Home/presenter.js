import React, { PropTypes } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import Touchable from '../common/F8Touchable';
import colors from '../common/color';
import styles from './style';
import logo from '../../images/logo.png';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const latitudeDelta = 0.03; // Approx. viewport of 3km
const longitudeDelta = latitudeDelta * ASPECT_RATIO;

const buttonBackground =
  TouchableNativeFeedback.Ripple(colors.rippleColor, true); // eslint-disable-line new-cap

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotateValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.runAnimation();
  }

  componentDidUpdate(prevProps) {
    const { latitude, longitude, selectedPlace } = this.props;
    if (this.map &&
      (prevProps.latitude !== latitude ||
      prevProps.longitude !== longitude)) {
      this.map.animateToRegion({ latitude, longitude, latitudeDelta, longitudeDelta });
    } else if (this.map && selectedPlace) {
      this.map.animateToRegion({
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
        latitudeDelta,
        longitudeDelta,
      });
    }
  }

  // Returns a random integer between min (included) and max (excluded)
  // Using Math.round() will give you a non-uniform distribution!
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  runAnimation() {
    this.state.rotateValue.setValue(0);
    Animated.decay(this.state.rotateValue, {
      fromValue: 0,
      toValue: 360,
      velocity: 2,
    }).start(() => this.runAnimation());
  }

  handleNavigate() {
    const { latitude, longitude } = this.props.selectedPlace;
    const url = `google.navigation:q=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) => {
      Alert.alert(
        'An error occurred',
        err,
        [{ text: 'OK' }]
      );
    });
  }

  handleGetRandomPlace() {
    const { places } = this.props;
    const index = this.getRandomInt(0, places.length);
    this.props.doSetSelectedPlace(places[index]);
  }

  renderSelectedPlace() {
    const { selectedPlace } = this.props;
    if (selectedPlace) {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.text}>{selectedPlace.name}</Text>
          <Text style={styles.subtext}>{selectedPlace.vicinity}</Text>
          <View style={styles.separator} />
          <Touchable
            onPress={() => this.handleNavigate()}
          >
            <View style={styles.navContainer}>
              <Text style={styles.navText}>GET DIRECTIONS</Text>
            </View>
          </Touchable>
        </View>
      );
    }
    return null;
  }

  renderMarker(place) {
    const { selectedPlace } = this.props;
    const { latitude, longitude, name } = place;
    if (selectedPlace && selectedPlace.name === name) {
      return (
        <MapView.Marker
          coordinate={{ latitude, longitude }}
          pinColor={colors.accentColor}
        />
      );
    }

    return null;
  }

  renderLoading() {
    const rotate = this.state.rotateValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <View style={styles.loadingContainer}>
        <Animated.Image
          source={logo}
          style={[
            styles.loadingLogo,
            { transform: [{ rotate }] },
          ]}
        />
        <Text style={styles.loadingText}>Searching for nearby restaurants</Text>
      </View>
    );
  }

  render() {
    const { latitude, longitude, places } = this.props;

    if (!places.length) {
      return this.renderLoading();
    }

    return (
      <View style={styles.container}>
        <MapView
          ref={(c) => { this.map = c; }}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton={false}
          initialRegion={{ latitude, longitude, latitudeDelta, longitudeDelta }}
          style={styles.map}
        >
          {places.map(place => this.renderMarker(place))}
        </MapView>
        {this.renderSelectedPlace()}
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <Touchable
              background={buttonBackground}
              onPress={() => this.handleGetRandomPlace()}
            >
              <View>
                <Image style={styles.logo} source={logo} />
              </View>
            </Touchable>
          </View>
        </View>
      </View>
    );
  }
}

Home.propTypes = {
  doSetSelectedPlace: PropTypes.func,
  getNearbyPlaces: PropTypes.func,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  places: PropTypes.array,
  selectedPlace: PropTypes.object,
};

export default Home;
