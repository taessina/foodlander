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
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import MapView from 'react-native-maps';
import Config from 'react-native-config';
import querystring from 'query-string';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput from '../../components/SearchInput';
import SearchBar from '../../components/SearchBar';
import F8Touchable from '../../components/F8Touchable';
import AnimatedLogo from '../../components/AnimatedLogo';
import FloatingActionButton from '../../components/FloatingActionButton';
import colors from '../../themes/color';
import styles from './style';
import AnimatedBackgound from './AnimatedBackground';
import Splashscreen from '../Splashscreen';
import FavList from '../Favorite/FavList';

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
  getFocusedPlace: Function,
  getNearbyPlaces: Function,
  resetArea: Function,
  resetExtPlaces: Function,
  doPlaceSelected: Function,
  doSetFav: Function,
  doSetFavMode: Function,
  doSetFavChoosed: Function,
  doCreateNewList: Function,
  doAddNewPlace: Function,
  doRemoveList: Function,
  doRemovePlace: Function,
  latitude: number,
  longitude: number,
  delta: number,
  places: Array<any>,
  extPlaces: Array<any>,
  focPlaces: Array<any>,
  index: number,
  isAreaSearch: boolean,
  locationLocked: boolean,
  favouriteList: Object[],
  favMode: boolean,
  favChoosed: string,
  favMenu: boolean,
  photos: string[],
  listTitle: string[],
};

type State = {
  search: boolean,
  favouritePlaces: Object[],
  maxIndex: number,
  extendedIndex: number,
  focusedIndex: number,
  favouriteIndex: number,
  photos: String[],
  displayPhotos: boolean,
  isFetchingPhoto: boolean,
  isFetched: boolean,
  listFound: boolean,
  range: Object,
  currentLoc: {latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number},
};

const PLACES_PHOTO_API = 'https://maps.googleapis.com/maps/api/place/photo?';
const key = Config.GOOGLE_MAPS_API_KEY;

export default class Home extends React.Component<Props, State> {
  state = {
    search: false,
    favouritePlaces: [],
    maxIndex: 10,
    extendedIndex: -10,
    focusedIndex: -10,
    favouriteIndex: -10,
    photos: [],
    displayPhotos: false,
    isFetchingPhoto: false,
    isFetched: false,
    listFound: false,
    range: { desc: 'default', value: 2000 },
    currentLoc: {
      latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0,
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
      this.updateLocation(latitude, longitude, latitudeDelta, longitudeDelta);
      this.mapLoadTimer = setTimeout(() => {
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
        this.updateLocation(latitude, longitude, 0.005, 0.005 * ASPECT_RATIO);
      }
    } else if (prevProps.latitude !== latitude || prevProps.longitude !== longitude) {
      this.props.getNearbyPlaces({ latitude, longitude });
      if (this.map) {
        this.updateLocation(latitude, longitude, latitudeDelta, longitudeDelta);
      }
    } else if ((prevProps.index !== index) && (index !== null)) {
      const place = places[index];
      const id = place.place_id;
      this.props.doPlaceSelected(id);

      if (place && this.map) {
        const lat = place.latitude + 0.001;
        const lng = place.longitude;
        const latDelta = 0.005;
        const lngDelta = 0.005 * ASPECT_RATIO;
        this.updateLocation(lat, lng, latDelta, lngDelta);
      }
    }

    if (this.props.listTitle !== '') {
      this.checkListTitle();
    }

    // when there's change between Choosed Favourite
    if (prevProps.favChoosed !== this.props.favChoosed) {
      this.endFavMode();
      this.LoadFavouritePlaces(this.props.favChoosed);
      this.disableCABLeft(prevState);
    }

    // when there's change in current location
    if (prevState.currentLoc !== this.state.currentLoc) {
      this.moveToCurrentLocation();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.mapLoadTimer);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  getNextPlace() {
    this.dumpPhotos();
    this.handleFetchPhoto('stop');
    this.photoSwitch('manual', false);
    if (this.state.range.desc === 'extended') {
      this.getNextExtended();
    } else if (this.state.range.desc === 'focused') {
      this.getNextFocused();
    } else if (this.props.index < this.state.maxIndex) {
      this.props.getNextPlace();
    } else {
      // prompt to increase area when index > maxIndex
      ToastAndroid.showWithGravityAndOffset('Try Somewhere Else', ToastAndroid.LONG, ToastAndroid.BOTTOM, 300, 550);
      this.setState({
        maxIndex: this.state.maxIndex + 20,
      });
      this.props.getNextPlace();
    }
  }

  // retrieve and animate to a random favourite place
  getNextFavourite() {
    const place = this.getFavouritePlace();
    if ((place !== null) && (this.map)) {
      const latitude = place.latitude + 0.001;
      const { longitude } = place;
      const latitudeDelta = 0.005;
      const longitudeDelta = 0.005 * ASPECT_RATIO;
      this.updateLocation(latitude, longitude, latitudeDelta, longitudeDelta);
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
      const latitude = place.latitude + 0.002;
      const { longitude } = place;
      const latDelta = 0.01;
      const lngDelta = 0.01 * ASPECT_RATIO;
      this.updateLocation(latitude, longitude, latDelta, lngDelta);
    }
  }

  // randomly animated to an focused place
  getNextFocused() {
    const place = this.getFocusedPlace();
    if ((place !== null) && (this.map)) {
      const latitude = place.latitude + 0.00015;
      const { longitude } = place;
      const latDelta = 0.0009;
      const lngDelta = 0.0009 * ASPECT_RATIO;
      this.updateLocation(latitude, longitude, latDelta, lngDelta);
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

  // randomly retrieve focused Place
  getFocusedPlace() {
    const index = this.state.focusedIndex;
    const max = this.props.focPlaces.length;
    let randIndex = index;
    let loop = true;
    if (this.props.focPlaces.length > 1) {
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
      focusedIndex: randIndex,
    });
    return this.props.focPlaces[randIndex];
  }

  // update current latitude and longitude
  updateLocation(lat: number, lng: number, latDelta: number, lngDelta: number) {
    this.setState({
      currentLoc: {
        latitude: lat,
        longitude: lng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      },
    });
  }

  moveToCurrentLocation() {
    this.map.animateToRegion({
      latitude: this.state.currentLoc.latitude,
      longitude: this.state.currentLoc.longitude,
      latitudeDelta: this.state.currentLoc.latitudeDelta,
      longitudeDelta: this.state.currentLoc.longitudeDelta,
    });
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
    let latDelta = 0;
    let lngDelta = 0;
    let latOffSet = 0;

    if (this.state.range.desc === 'focused') {
      this.setState({
        focusedIndex: -10,
        range: { desc: 'default', value: 2000 },
      });
      latDelta = 0.005;
      lngDelta = 0.005 * ASPECT_RATIO;
      latOffSet = 0.00075;
    } else if (this.state.range.desc === 'default') {
      this.setState({
        range: { desc: 'extended', value: 4000 },
      });
      if (this.props.extPlaces.length === 0) {
        this.props.getExtendedPlace({ latitude, longitude });
      }
      latDelta = 0.01;
      lngDelta = 0.01 * ASPECT_RATIO;
      latOffSet = 0.001;
    }

    if (place && this.map) {
      const lat = this.state.currentLoc.latitude + latOffSet;
      const lng = this.state.currentLoc.longitude;
      this.updateLocation(lat, lng, latDelta, lngDelta);
    }
  }

  // retrieve focused places or dump extended places, zoom in animation
  fall() {
    const { places, latitude, longitude } = this.props;
    const place = places[this.props.index];
    let latDelta = 0;
    let lngDelta = 0;
    let latOffSet = 0;

    if (this.state.range.desc === 'extended') {
      this.setState({
        extendedIndex: -10,
        range: { desc: 'default', value: 2000 },
      });
      latDelta = 0.005;
      lngDelta = 0.005 * ASPECT_RATIO;
      latOffSet = 0.001;
    } else if (this.state.range.desc === 'default') {
      this.setState({
        range: { desc: 'focused', value: 500 },
      });
      if (this.props.focPlaces.length === 0) {
        this.props.getFocusedPlace({ latitude, longitude });
      }
      latDelta = 0.0009;
      lngDelta = 0.0009 * ASPECT_RATIO;
      latOffSet = 0.00015;
    }
    if (this.map && place) {
      const lat = place.latitude + latOffSet;
      const lng = place.longitude;
      this.updateLocation(lat, lng, latDelta, lngDelta);
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
  }

  map: MapView;
  mapLoadTimer: number;

  markerSelected() {
    this.updateLocation(
      this.state.currentLoc.latitude,
      this.state.currentLoc.longitude,
      this.state.currentLoc.latitudeDelta,
      this.state.currentLoc.longitudeDelta,
    );
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
    if (!this.props.favMode) {
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
          extendedIndex: -10,
        });
        return true;
      }
    } else {
      this.props.doSetFavMode(false);
      this.props.doSetFavChoosed('');
      return true;
    }

    return false;
  }

  checkFavourite(subject: string): boolean {
    if (this.props.favouriteList.length > 0) {
      for (let i = 0; i < this.props.favouriteList.length; i += 1) {
        for (let u = 0; u < this.props.favouriteList[i].items.length; u += 1) {
          if (this.props.favouriteList[i].items[u].name === subject) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // fetch photo url using photo reference id
  fetchPhoto(referenceId: string, index: number): void {
    const params = {
      photoreference: referenceId,
      maxheight: 150,
      maxweight: 150,
      key,
    };

    fetch(
      `${PLACES_PHOTO_API}${querystring.stringify(params)}`,
      {
        method: 'HEAD',
      },
    )
      .then((response) => {
        if (response) {
          const tempPhotos = this.state.photos;
          // prevent dummy photos
          if (response.url.search('googleapis') === -1) {
            tempPhotos.push(response.url);
            this.setState({
              photos: tempPhotos,
            });
            if (index === this.props.photos.length - 1) {
              this.handleFetchPhoto('fetched');
            }
          }
        }
      })
      .catch(() => {
        // Retry 5s later, inhibiting errors
        setTimeout(
          this.fetchPhoto(referenceId, index),
          5000,
        );
      });
  }

  photoSwitch(mode: string, statement: boolean) {
    switch (mode) {
      case 'auto':
        if (this.state.displayPhotos) {
          this.setState({
            displayPhotos: false,
          });
        } else {
          this.setState({
            displayPhotos: true,
          });
        }
        break;
      case 'manual':
        this.setState({
          displayPhotos: statement,
        });
        break;
      default:
    }
  }

  dumpPhotos() {
    this.setState({
      photos: [],
    });
  }

  fetchPhotoClicked() {
    if (this.state.displayPhotos) {
      this.handleFetchPhoto('stop');
    } else if (this.props.photos.length > 0) {
      this.handleFetchPhoto('fetch');
      this.props.photos.map((item, i) => {
        this.fetchPhoto(item, i);
        return null;
      });
    }
  }

  handleFetchPhoto(mode: string) {
    switch (mode) {
      case 'fetch':
        this.setState({
          isFetchingPhoto: true,
        });
        break;
      case 'fetched':
        this.setState({
          displayPhotos: true,
          isFetched: true,
          isFetchingPhoto: false,
        });
        break;
      case 'stop':
        this.setState({
          displayPhotos: false,
          isFetched: false,
        });
        break;
      default:
    }
  }

  checkListTitle() {
    let found = false;
    // check if list existed
    for (let i = 0; i < this.props.favouriteList.length; i += 1) {
      const title = this.props.favouriteList.map((item) => {
        const temp = item.title;
        return temp;
      });
      if (title[i] === this.props.listTitle) {
        found = true;
        break;
      }
    }
    if (found) {
      if (!this.state.listFound) {
        this.setState({
          listFound: true,
        });
      }
    } else if (this.state.listFound) {
      this.setState({
        listFound: false,
      });
    }
  }

  retrieveList(): Object {
    for (let i = 0; i < this.props.favouriteList.length; i += 1) {
      const title = this.props.favouriteList.map((item) => {
        const temp = item.title;
        return temp;
      });
      if (title[i] === this.props.listTitle) {
        return this.props.favouriteList[i];
      }
    }
    return {};
  }

  favButtonPressed(isFavourite: boolean, place: Place) {
    if (!isFavourite) {
      if (!this.state.listFound) {
        this.props.doCreateNewList(this.props.listTitle);
      }
      if (place !== null) {
        this.props.doAddNewPlace(place, this.props.listTitle);
      }
    } else {
      const currentList = this.retrieveList();
      if (currentList.items.length === 1) {
        this.props.doRemoveList(this.props.listTitle);
      } else {
        this.props.doRemovePlace(place, this.props.listTitle);
      }
    }
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

  renderPhotoItems(items: String, index: number) {
    return (
      <Image key={index} source={{ uri: items }} alt="not found" style={styles.photo} />
    );
  }

  renderPhotos() {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        { this.state.photos.map((item, index) => this.renderPhotoItems(item, index)) }
      </ScrollView>
    );
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
      const isFavourite = this.checkFavourite(tempPlace.name);
      let photoMessage = '';

      if (!this.props.favMode) {
        if (this.props.photos.length > 0) {
          photoMessage = 'SHOW PHOTOS';
        } else {
          photoMessage = 'NO PHOTOS FOUND';
        }

        if (this.state.isFetchingPhoto) {
          photoMessage = 'FETCHING PHOTOS';
        } else if (this.state.isFetched) {
          if (this.state.photos.length > 0) {
            photoMessage = 'HIDE PHOTO';
          } else {
            photoMessage = 'NO PHOTOS FOUND';
          }
        }
      }

      return (
        <View style={styles.textContainer}>
          {this.props.favMode ? null : this.renderFavButton(isFavourite, tempPlace)}
          <Text style={styles.text}>{tempPlace.name}</Text>
          <Text
            numberOfLines={1}
            style={styles.subtext}
          >
            {tempPlace.vicinity}
          </Text>
          {this.renderRating(tempPlace.rating)}
          <View style={styles.separator} />
          <View style={styles.navContainer}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <F8Touchable onPress={() => this.fetchPhotoClicked()}>
                <Text style={
                  this.props.photos.length > 0 ? styles.navText : { color: colors.disabledColor }
                }
                >
                  {photoMessage}
                </Text>
              </F8Touchable>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <F8Touchable
                onPress={() => this.handleNavigate()}
              >
                <Text style={styles.navText}>GET DIRECTIONS</Text>
              </F8Touchable>
            </View>
          </View>
          {this.state.displayPhotos ? this.renderPhotos() : null}
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

  renderFavButton(isFavourite: boolean, place: Place) {
    return (
      <F8Touchable onPress={() => this.favButtonPressed(isFavourite, place)}>
        <Icon
          name="favorite"
          size={30}
          color={isFavourite ? 'rgb(255, 50, 50)' : colors.disabledColor}
          style={{ position: 'absolute', right: 7, top: 7 }}
        />
      </F8Touchable>
    );
  }

  renderMarkers() {
    let place = null;
    let color;

    if (!this.props.favMode) {
      if (this.state.extendedIndex !== -10) {
        const places = this.props.extPlaces;
        const index = this.state.extendedIndex;
        color = colors.accentColor;
        place = places[index];
      } else if (this.state.focusedIndex !== -10) {
        const places = this.props.focPlaces;
        const index = this.state.focusedIndex;
        color = colors.accentColor;
        place = places[index];
      } else if (this.props.index !== null) {
        const { places } = this.props;
        const { index } = this.props;
        color = colors.accentColor;
        place = places[index];
      }
    } else if (this.props.favMode) {
      if (this.state.favouriteIndex !== -10) {
        const { favouritePlaces } = this.state;
        const { favouriteIndex } = this.state;
        color = colors.accentColor2;
        place = favouritePlaces[favouriteIndex];
      }
    }
    if (place !== null) {
      const { latitude, longitude, place_id: id } = place;
      return (
        <MapView.Marker
          coordinate={{ latitude, longitude }}
          identifier={id}
          pinColor={color}
          title={place.name}
          key={id}
          onPress={() => this.markerSelected()}
        />
      );
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
          onPress={() => this.markerSelected()}
        />
      );
    });
  }

  renderFavBar() {
    if (this.props.places.length > 0) {
      let message;
      let message2 = '';
      let title = '';
      if (!this.props.favMode) {
        message = 'Choose from favourite list';
      } else {
        title = this.props.favChoosed.toUpperCase();
        message = 'Searching ';
        message2 = ' list';
      }
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 50,
            backgroundColor: this.props.favMode ? colors.subAccentColor2 : colors.subAccentColor,
          }}
          onPress={() => this.openFavList()}
        >
          <Text style={{
            color: this.props.favMode ? '#808080' : '#FFFFFF',
            marginLeft: 20,
            marginTop: 13,
            fontSize: 15,
            }}
          >
            { message }
            <Text style={{ fontWeight: 'bold' }}>{ title }</Text>
            { message2 }
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  }

  // render default floating action button (pink)
  renderFAB() {
    if (this.props.places.length) {
      return (
        <FloatingActionButton
          position="right"
          onPress={() => this.getNextPlace()}
          buttonColor={colors.accentColor}
          pushed={!!this.props.favMenu}
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
          position="right"
          onPress={() => this.getNextFavourite()}
          buttonColor={colors.accentColor2}
          pushed={!!this.props.favMenu}
        >
          <Icon name="shuffle" size={24} color="#FFF" />
        </FloatingActionButton>
      );
    }
    return null;
  }

  renderExtendPill() {
    if (this.props.places.length) {
      return (
        <FloatingActionButton
          orientation="up"
          position="topRight"
          onPress={this.state.range.desc !== 'extended' ? () => this.escalate() : () => null}
          buttonColor="#FFF"
          pushed={!!this.props.favMenu}
          disabled={!this.state.range.desc !== 'extended'}
        >
          <Icon name="add" size={20} color={this.state.range.desc !== 'extended' ? colors.accentColor : colors.disabledColor} />
        </FloatingActionButton>
      );
    }
    return null;
  }

  renderContractPill() {
    if (this.props.places.length) {
      return (
        <FloatingActionButton
          orientation="down"
          position="bottomRight"
          onPress={this.state.range.desc !== 'focused' ? () => this.fall() : () => null}
          buttonColor="#FFF"
          pushed={!!this.props.favMenu}
          disabled={!this.state.range.desc !== 'focused'}
        >
          <Icon name="remove" size={20} color={this.state.range.desc !== 'focused' ? colors.accentColor : colors.disabledColor} />
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

  renderAreaText() {
    return (
      <View style={styles.areaTextContainer}>
        <Text style={styles.areaText}>{this.state.range.value}m</Text>
      </View>
    );
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
        {this.state.maxIndex > 10 && !this.props.favMode ? this.renderExtendPill() : null}
        {this.state.maxIndex > 10 && !this.props.favMode ? this.renderContractPill() : null}
        {this.state.maxIndex > 10 && !this.props.favMode ? this.renderAreaText() : null}
        {this.props.favMode ? this.renderFAB2() : this.renderFAB()}
        {this.renderFavBar()}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Splashscreen />
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
          { this.renderMarkers() }
        </MapView>
        {this.renderLoading()}
        {this.renderComponents()}
      </View>
    );
  }
}
