import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const URL = 'https://rickandmortyapi.com/graphql';

const DetailsScreen = ({ route }) => {
	const QUERY = `
	query Query {
		character(id: ${route.params.id}) {
			created
			id
			gender
			image
			name
			type
		}
	}
	`;
	const [character, setCharacter] = useState(null);
	useEffect(() => {
		fetch(URL, {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query: QUERY })
		}).then(response => response.json())
			.then(data => setCharacter(data.data.character))
	}, []);
	return (
		<View style={{ flex: 1 }}>
			{
				character ? <View style={{ alignItems: 'center', paddingTop: 20 }}>
					<Image source={{ uri: character.image }} style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 20 }} />
					<Text>Name: {character.name}</Text>
					<Text>Gender: {character.gender}</Text>
					<Text>Type: {character.type}</Text>
					<Text>Created At: {character.created}</Text>
				</View> : null
			}
		</View>
	)
}
const HomeScreen = ({ navigation }) => {
	const QUERY = `
	query Query {
		characters(page: 1) {
		  results {
			id,
			name,
			image
		  }
		}
	}
	`;
	const [characters, setCharacters] = useState([]);
	useEffect(() => {
		fetch(URL, {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query: QUERY })
		}).then(response => response.json())
			.then(data => setCharacters(data.data.characters.results))
	}, []);
	return (
		<View style={{ flex: 1 }}>
			<Text style={{ fontSize: 30, color: '#000', alignSelf: 'center', marginBottom: '5%' }}>Character Listing</Text>
			<ScrollView>
				{
					characters.map((element, index) => <TouchableOpacity key={index} onPress={() => navigation.navigate('Details', { id: element.id })} style={{
						padding: '3%',
						margin: '1%',
						borderRadius: 5,
						borderWidth: 1,
						borderColor: '#000'
					}}>
						<Text>{element.name}</Text>
					</TouchableOpacity>)
				}
			</ScrollView>
		</View>
	);
}

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Home"
			>
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={{ title: 'Welcome' }}
				/>
				<Stack.Screen name="Details" component={DetailsScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	)
};
export default App;
