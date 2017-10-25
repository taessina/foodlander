import React from 'react';
import propTypes from 'prop-types';
import {
  Alert,
  BackAndroid,
  Dimensions,
  Linking,
  Text,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput from '../SearchInput';
import SearchBar from '../SearchBar';
import Touchable from '../common/F8Touchable';
import AnimatedLogo from '../common/AnimatedLogo';
import FloatingActionButton from '../common/FloatingActionButton';
import colors from '../common/color';
import styles from './style';
import AnimatedBackgound from './AnimatedBackground';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const latitudeDelta = 0.005; // Approx. viewport of 500m horizontally
const longitudeDelta = latitudeDelta * ASPECT_RATIO;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, search: false };
  }

  componentDidMount() {
    const { latitude, longitude, locationLocked } = this.props;

    if (locationLocked) {
      // HACK: Shamefully map doesn't load instantly, thus ugly hack
      this.mapLoadTimer = setTimeout(() => {
        this.map.animateToRegion({
          latitude, longitude, latitudeDelta, longitudeDelta,
        });
        this.props.getNearbyPlaces({ latitude, longitude });
      }, 5000);
    }

    BackAndroid.addEventListener('hardwareBackPress', () => this.handleBackButton());
  }

  componentDidUpdate(prevProps) {
    const {
      latitude, longitude, places, index,
    } = this.props;
    if (!prevProps.locationLocked && this.props.locationLocked) {
      this.map.animateToRegion({
        latitude, longitude, latitudeDelta, longitudeDelta,
      });
      this.props.getNearbyPlaces({ latitude, longitude });
    } else if (prevProps.latitude !== latitude || prevProps.longitude !== longitude) {
      this.props.getNearbyPlaces({ latitude, longitude });
      this.map.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01 * ASPECT_RATIO,
      });
    } else if (prevProps.index !== index) {
      const place = places[index];
      if (place) {
        this.map.animateToRegion({
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta,
          longitudeDelta,
        });
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.mapLoadTimer);
    BackAndroid.removeEventListener('hardwareBackPress', () => this.handleBackButton());
  }

  handleBackButton() {
    if (this.state.search) {
      this.setState({ search: false });
      return true;
    }

    if (this.props.isAreaSearch) {
      this.props.resetArea();
      return true;
    }

    return false;
  }

  handleNavigate() {
    const { places, index } = this.props;
    const { latitude, longitude, name } = places[index];
    const url = `geo:0,0?q=${latitude},${longitude}(${name})`;
    Linking.openURL(url).catch((err) => {
      Alert.alert(
        'An error occurred',
        err,
        [{ text: 'OK' }],
      );
    });
  }

  renderRating(rating) {
    if (rating) {
      const stars = [];
      for (let i = 0; i < 5; i++) {
        stars.push((
          <Icon
            name={Math.round(rating) > i ? 'star' : 'star-border'}
            size={24}
            color={colors.ratingColor}
            key={i}
          />
        ));
      }
      return (
        <View style={styles.rating}>
          {stars}
        </View>
      );
    }

    return null;
  }

  renderSelectedPlace() {
    const { places, index } = this.props;
    const place = places[index];

    if (!this.props.locationLocked || !places.length) {
      return null;
    }

    if (place) {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.text}>{place.name}</Text>
          <Text
            numberOfLines={1}
            style={styles.subtext}
          >
            {place.vicinity}
          </Text>
          {this.renderRating(place.rating)}
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
    return (
      <View style={[styles.textContainer, styles.textContainerWithoutAction]}>
        <Text style={styles.text}>Foodlander</Text>
        <Text style={styles.subtext}>
          Tap the button below to discover your next favourite food place.
        </Text>
      </View>
    );
  }

  renderMarkers() {
    const { places, index } = this.props;
    return places.map((place, i) => {
      const { latitude, longitude, place_id: id } = place;
      const color = index === i ? colors.selectedPinColor : colors.accentColor;
      return (
        <MapView.Marker
          coordinate={{ latitude, longitude }}
          identifier={id}
          pinColor={color}
          title={place.name}
          key={id}
        />
      );
    });
  }

  renderFAB() {
    if (this.props.places.length) {
      return (
        <FloatingActionButton
          position="center"
          onPress={this.props.getNextPlace}
          buttonColor={colors.accentColor}
        >
          <Icon name="local-dining" size={24} color="#fff" />
        </FloatingActionButton>
      );
    }
    return null;
  }

  renderSearchInput() {
    if (!this.state.search) return null;
    return (
      <SearchInput
        onBack={() => this.setState({ search: false })}
      />
    );
  }

  renderLoading() {
    if (!this.props.locationLocked || !this.props.places.length) {
      return (
        <View style={styles.loading}>
          <AnimatedLogo size={64} />
        </View>
      );
    }

    return null;
  }

  renderComponents() {
    if (this.state.search) {
      return (
        <View style={{ flex: 1 }}>
          <AnimatedBackgound />
          {this.renderSearchInput()}
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        {<SearchBar onPress={() => this.setState({ search: true })} />}
        {this.renderSelectedPlace()}
        {this.renderFAB()}
      </View>
    );
  }

  render() {
    if (this.state.loading) {
      return <AnimatedLogo onEnd={() => this.setState({ loading: false })} />;
    }

    return (
      <View style={styles.container}>
        <MapView
          ref={(c) => { this.map = c; }}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton={false}
          initialRegion={{
            latitude: 10,
            longitude: 110,
            latitudeDelta: 50,
            longitudeDelta: 50 * ASPECT_RATIO,
          }}
          style={styles.map}
        >
          {this.renderMarkers()}
        </MapView>
        {this.renderLoading()}
        {this.renderComponents()}
      </View>
    );
  }
}

Home.propTypes = {
  getNextPlace: propTypes.func.isRequired,
  getNearbyPlaces: propTypes.func.isRequired,
  resetArea: propTypes.func.isRequired,
  latitude: propTypes.number.isRequired,
  longitude: propTypes.number.isRequired,
  locationLocked: propTypes.bool.isRequired,
  places: propTypes.arrayOf.isRequired,
  index: propTypes.number.isRequired,
  isAreaSearch: propTypes.bool.isRequired,
};

export default Home;
