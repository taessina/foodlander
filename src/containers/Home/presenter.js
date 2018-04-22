// @flow
import React from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Linking,
  Text,
  View,
  ToastAndroid,
} from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput from '../../components/SearchInput';
import SearchBar from '../../components/SearchBar';
import Touchable from '../../components/F8Touchable';
import AnimatedLogo from '../../components/AnimatedLogo';
import FloatingActionButton from '../../components/FloatingActionButton';
import CornerActionButton from '../../components/CornerActionButton';
import colors from '../../themes/color';
import styles from './style';
import AnimatedBackgound from './AnimatedBackground';
import Splashscreen from '../Splashscreen';
import Restaurant from './Restaurant';
import FavList from './FavList';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;

type Place = {
  latitude: number;
  longitude: number;
  name: string;
  opening_hours: ?{ open_now: boolean };
  permanently_closed: ?boolean;
  place_id: string;
  rating: ?number;
  vicinity: string;
  geometry: Object;
};

type Props = {
  getNextPlace: Function,
  getExtendedPlace: Function,
  getNearbyPlaces: Function,
  resetArea: Function,
  resetExtPlaces: Function,
  doMarkerSelected: Function,
  doSetFav: Function,
  doSetFavMode: Function,
  latitude: number,
  longitude: number,
  delta: number,
  places: Array<any>,
  extPlaces: Array<any>,
  index: number,
  isAreaSearch: boolean,
  locationLocked: boolean,
  resModal: boolean,
  favouriteList: Object[],
  favMode: boolean,
  favChoosed: string,
};

type State = {
  search: boolean,
  favouritePlaces: Object[],
  maxIndex: number,
  renderCABLeft: boolean,
  extendedIndex: number,
  favouriteIndex: number,
  currentPlace: Place,
};

export default class Home extends React.Component<Props, State> {
  state = {
    search: false,
    favouritePlaces: [],
    maxIndex: 10,
    renderCABLeft: false,
    extendedIndex: -10,
    favouriteIndex: -10,
    currentPlace: {
      latitude: 0,
      longitude: 0,
      name: '',
      opening_hours: { open_now: false },
      permanently_closed: false,
      place_id: '',
      rating: 0,
      vicinity: '',
      geometry: {},
    },
  };

  componentDidMount() {
    const {
      latitude, longitude, locationLocked,
    } = this.props;

    const latitudeDelta = 0.005; // Approx. viewport of 500m horizontally
    const longitudeDelta = latitudeDelta * ASPECT_RATIO;

    if (locationLocked) {
      // HACK: Shamefully map doesn't load instantly, thus ugly hack
      this.mapLoadTimer = setTimeout(() => {
        this.map.animateToRegion({
          latitude, longitude, latitudeDelta, longitudeDelta,
        });
        this.props.getNearbyPlaces({ latitude, longitude });
      }, 10000);
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const {
      latitude, longitude, delta, places, index,
    } = this.props;
    const latitudeDelta = delta; // Approx. viewport of 500m horizontally
    const longitudeDelta = latitudeDelta * ASPECT_RATIO;

    if (!prevProps.locationLocked && this.props.locationLocked) {
      if (this.map) {
        this.map.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005 * ASPECT_RATIO,
        });
      }
    } else if (prevProps.latitude !== latitude || prevProps.longitude !== longitude) {
      this.props.getNearbyPlaces({ latitude, longitude });
      if (this.map) {
        this.map.animateToRegion({
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        });
      }
    } else if (prevProps.index !== index) {
      const place = places[index];
      if (place && this.map) {
        this.map.animateToRegion({
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: this.props.extPlaces.length > 0 ? 0.01 : 0.005,
          longitudeDelta: this.props.extPlaces.length > 0 ?
            0.01 * ASPECT_RATIO : 0.005 * ASPECT_RATIO,
        });
      }
    }
    // closing and opening restaurant modal
    if ((prevProps.resModal) && (!this.props.resModal)) {
      let place = null;
      // if current place is not an extendedPlace
      if (this.state.extendedIndex === -10) {
        place = places[index];
      } else {
        place = this.props.extPlaces[this.state.extendedIndex];
      }
      if ((this.map) && (place !== null)) {
        this.map.animateToRegion({
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005 * ASPECT_RATIO,
        });
      }
    }
    // When there's change between favourite mode and defualt mode
    if (prevProps.favMode !== this.props.favMode) {
      if (this.map) {
        this.map.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: this.props.extPlaces.length > 0 ? 0.01 : 0.005,
          longitudeDelta: this.props.extPlaces.length > 0 ?
            0.01 * ASPECT_RATIO : 0.005 * ASPECT_RATIO,
        });
      }
      // When in Favourite Mode
      if (this.props.favMode) {
        this.LoadFavouritePlaces(this.props.favChoosed);
        this.disableCABLeft(prevState);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.mapLoadTimer);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  getNextPlace() {
    if (this.props.extPlaces.length > 0) {
      // the ratio to jumped into extended places than old places is 3 : 1
      let randInt = 0;
      randInt = Math.floor(Math.random() * (4));
      switch (randInt) {
        case 0:
        case 1:
        case 2:
          this.getNextExtended();
          break;
        case 3:
          this.props.getNextPlace();
          // reset extendedIndex to null
          this.setState({
            extendedIndex: -10,
          });
          break;
        default:
      }
    } else if (this.props.index < this.state.maxIndex) {
      this.props.getNextPlace();
    } else {
      // prompt to increase area when index > maxIndex
      ToastAndroid.showWithGravityAndOffset('Try Somewhere Further', ToastAndroid.LONG, ToastAndroid.BOTTOM, -180, 60);
      this.setState({
        maxIndex: this.state.maxIndex + 20,
        renderCABLeft: true,
      });
      this.props.getNextPlace();
    }
  }

  // retrieve and animate to a random favourite place
  getNextFavourite() {
    const place = this.getFavouritePlace();
    if ((place !== null) && (this.map)) {
      this.map.animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01 * ASPECT_RATIO,
      });
    }
  }

  // randomly retrieve favouritePlace
  getFavouritePlace() {
    const { favouriteIndex } = this.state;
    let randIndex = favouriteIndex;
    if (this.props.favouriteList.length > 0) {
      if (this.state.favouritePlaces.length > 0) {
        const max = this.state.favouritePlaces.length;
        let loop = true;
        if (this.state.favouritePlaces.length > 1) {
          while (loop) {
            randIndex = Math.floor(Math.random() * (max));
            if (randIndex !== favouriteIndex) {
              loop = false;
            }
          }
        } else {
          randIndex = 0;
        }
        if (this.state.favouriteIndex !== randIndex) {
          this.setState({
            favouriteIndex: randIndex,
          });
        }
      }
    }
    return this.state.favouritePlaces[randIndex];
  }

  // randomly animated to an extended place
  getNextExtended() {
    const place = this.getExtendedPlace();
    if ((place !== null) && (this.map)) {
      this.map.animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005 * ASPECT_RATIO,
      });
    }
  }

  // randomly retrieve extendedPlace
  getExtendedPlace() {
    const index = this.state.extendedIndex;
    const max = this.props.extPlaces.length;
    let randIndex = index;
    let loop = true;
    if (this.props.extPlaces.length > 1) {
      while (loop) {
        randIndex = Math.floor(Math.random() * (max));
        if (randIndex !== index) {
          loop = false;
        }
      }
    } else {
      randIndex = 0;
    }
    this.setState({
      extendedIndex: randIndex,
    });
    return this.props.extPlaces[randIndex];
  }

  // hide Left Corner Action Button
  disableCABLeft(prevState: State) {
    if (this.state.extendedIndex !== prevState.extendedIndex) {
      this.setState({
        extendedIndex: -10,
      });
    }
  }

  // retrieve favouritePlace based on selected title
  LoadFavouritePlaces(listTitle: string) {
    for (let i = 0; i < this.props.favouriteList.length; i += 1) {
      if (this.props.favouriteList[i].title === listTitle) {
        if (this.state.favouritePlaces !== this.props.favouriteList[i].items) {
          this.setState({
            favouritePlaces: this.props.favouriteList[i].items,
          });
        }
        break;
      }
    }
  }

  // retrieve extended places, zoom out animation
  escalate() {
    const { places, latitude, longitude } = this.props;
    const place = places[this.props.index];

    this.props.getExtendedPlace({ latitude, longitude });

    if (place && this.map) {
      this.map.animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01 * ASPECT_RATIO,
      });
    }
  }

  // dump extended places, zoom in animation
  fall() {
    const { places } = this.props;
    const place = places[this.props.index];

    this.props.resetExtPlaces();
    this.setState({
      extendedIndex: -10,
    });
    if (this.map) {
      this.map.animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005 * ASPECT_RATIO,
      });
    }
  }

  // display favourite list title
  openFavList() {
    if (this.props.favouriteList.length > 0) {
      this.props.doSetFav(true);
    } else {
      ToastAndroid.show('There is no item in Favourite List', ToastAndroid.CENTER, ToastAndroid.LONG);
    }
  }

  // transition from favourite mode back to default mode
  endFavMode() {
    this.setState({
      favouritePlaces: [],
      favouriteIndex: -10,
    });
    this.props.doSetFavMode(false);
  }

  map: MapView;
  mapLoadTimer: number;

  markerSelected(place: Place, lat: number, lng: number) {
    const { place_id: id } = place;

    // search in places array for index
    let index = null;
    let extIndex = null;

    for (let i = 0; i < this.props.places.length; i += 1) {
      if (id === this.props.places[i].place_id) {
        index = i;
        break;
      }
    }

    if (this.props.extPlaces.length > 0) {
      for (let i = 0; i < this.props.extPlaces.length; i += 1) {
        if (id === this.props.extPlaces[i].place_id) {
          extIndex = i;
          break;
        }
      }
    }
    if ((this.props.index === index) || (this.state.extendedIndex === extIndex)) {
      this.props.doMarkerSelected(id);
      this.map.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0005,
        longitudeDelta: 0.0005 * ASPECT_RATIO,
      });
    }

    this.setState({
      currentPlace: place,
    });
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

  handleBackButton = () => {
    if (this.state.search) {
      this.setState({ search: false, extendedIndex: -10 });
      return true;
    }

    if (this.props.isAreaSearch) {
      this.props.resetArea();
      this.props.resetExtPlaces();
      // reset to initialstate
      this.setState({
        search: false,
        favouritePlaces: [],
        favouriteIndex: -10,
        maxIndex: 10,
        renderCABLeft: false,
        extendedIndex: -10,
      });
      return true;
    }

    return false;
  }

  renderRating(rating: number) {
    if (rating) {
      const stars = [];
      for (let i = 0; i < 5; i += 1) {
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
    let Places;
    let Index;

    // check for mode
    if (!this.props.favMode) {
      // check for extension
      if ((this.props.extPlaces.length <= 0) || (this.state.extendedIndex === -10)) {
        Places = this.props.places;
        Index = this.props.index;
      } else {
        Places = this.props.extPlaces;
        Index = this.state.extendedIndex;
      }
    } else {
      Places = this.state.favouritePlaces;
      Index = this.state.favouriteIndex;
    }

    const tempPlace = Places[Index];

    if (!this.props.locationLocked || !Places.length) {
      return null;
    }

    if (tempPlace) {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.text}>{tempPlace.name}</Text>
          <Text
            numberOfLines={1}
            style={styles.subtext}
          >
            {tempPlace.vicinity}
          </Text>
          {this.renderRating(tempPlace.rating)}
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
    let color;
    if (!this.props.favMode) {
      const { places } = this.props;
      const { index } = this.props;
      color = colors.accentColor;
      return places.map((place, i) => {
        const { latitude, longitude, place_id: id } = place;
        if (index === i) {
          color = colors.selectedPinColor;
        } else {
          color = colors.accentColor;
        }
        return (
          <MapView.Marker
            coordinate={{ latitude, longitude }}
            identifier={id}
            pinColor={color}
            title={place.name}
            key={id}
            onPress={() => this.markerSelected(place, latitude, longitude)}
          />
        );
      });
    } else if (this.props.favMode) {
      const { favouritePlaces } = this.state;
      const { favouriteIndex } = this.state;
      return favouritePlaces.map((place, i) => {
        const { latitude, longitude } = place;
        let { place_id: id } = place;
        id += 'fav';
        if (favouriteIndex === i) {
          color = colors.selectedPinColor;
        } else {
          color = colors.accentColor2;
        }
        return (
          <MapView.Marker
            coordinate={{ latitude, longitude }}
            identifier={id}
            pinColor={color}
            title={place.name}
            key={id}
            onPress={() => this.markerSelected(place, latitude, longitude)}
          />
        );
      });
    }
    return null;
  }

  // render Extended Markers
  renderExtMarkers() {
    const { extPlaces } = this.props;
    const extIndex = this.state.extendedIndex;

    return extPlaces.map((place, i) => {
      const { latitude, longitude, place_id: id } = place;
      let color;
      if (extIndex !== null) {
        color = extIndex === i ? colors.selectedPinColor : colors.accentColor3;
      } else {
        color = colors.accentColor;
      }
      return (
        <MapView.Marker
          coordinate={{ latitude, longitude }}
          identifier={id}
          pinColor={color}
          title={place.name}
          key={id}
          onPress={() => this.markerSelected(place, latitude, longitude)}
        />
      );
    });
  }

  // render default floating action button (pink)
  renderFAB() {
    if (this.props.places.length) {
      return (
        <FloatingActionButton
          position="center"
          onPress={() => this.getNextPlace()}
          buttonColor={colors.accentColor}
        >
          <Icon name="local-dining" size={24} color="#fff" />
        </FloatingActionButton>
      );
    }
    return null;
  }

  // render favourite floating action button (blue)
  renderFAB2() {
    if (this.props.places.length) {
      return (
        <FloatingActionButton
          position="center"
          onPress={() => this.getNextFavourite()}
          buttonColor={colors.accentColor2}
        >
          <Icon name="local-dining" size={24} color="#FFF" />
        </FloatingActionButton>
      );
    }
    return null;
  }

  // Left Corner Action Button
  renderCABLeft() {
    if (this.props.places.length) {
      return (
        <CornerActionButton
          position="left"
          onPress={this.props.extPlaces.length > 0 ? () => this.fall() : () => this.escalate()}
          mode={this.props.extPlaces.length > 0 ? 'contract' : 'expand'}
        />
      );
    }
    return null;
  }

  // Right Corner Action Button
  renderCABRight() {
    if (this.props.places.length) {
      return (
        <CornerActionButton
          position="right"
          onPress={
            this.props.favMode ? () => this.endFavMode() : () => this.openFavList()
          }
          mode={this.props.favMode ? 'fav' : 'default'}
        />
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
        {this.props.favMode ? this.renderFAB2() : this.renderFAB()}
        {this.state.renderCABLeft && !this.props.favMode ? this.renderCABLeft() : null}
        {this.renderCABRight()}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Splashscreen />
        <Restaurant place={this.state.currentPlace} />
        <FavList />
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
          {this.state.extendedIndex === -10 ? this.renderMarkers() : this.renderExtMarkers()}
        </MapView>
        {this.renderLoading()}
        {this.renderComponents()}
      </View>
    );
  }
}
