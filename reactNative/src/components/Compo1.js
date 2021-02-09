import React, {useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import btnHandler from '../btn'; 

export default function Compo1() {

	let colors = ['red', 'blue', 'purple', 'white'];

	let index = 0;
	const [color, setColor] = useState( colors[index] );


	colors.map( (el) => {
		console.log(el);
	})



	return(
		<View >

			{
				colors.map( (el, index) => {
					return (
						<Text key={index} style={[styles.text, {backgroundColor: el} ]} > { el } </Text>
					)
				})
			}
			<Button
				onPress={() => btnHandler()}
				title="Changer de couleur"
				color="#1C1C1C"
				accessibilityLabel="Learn more about this purple button"
			/>
		</View>
	)
}


const styles = StyleSheet.create({
	boite: {
		backgroundColor: 'red',
	},
	text: {
		color: 'white',
	}
})