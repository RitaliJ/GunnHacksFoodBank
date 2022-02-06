
const zipCodeInput = document.querySelector('#zipCodeInput');
const foodBanksList = document.querySelector('#foodBanksList');
const button = document.querySelector('#zipCodeButton');
const output = document.querySelector('#output');

const fetchCoordinates = async () => {
	try{
		const zipCode = zipCodeInput.value;
		const res = await axios.get(`https://geocode.xyz/?geoit=JSON&region=US&locate=${zipCode}`, zipCode);
		const lat = res.data.latt;
		const long = res.data.longt;
		console.log(lat + ", " + long);
		if(lat == undefined || long == undefined){
			throw new Exception;
		}
		fetchFoodBanks(lat, long);
	}catch(e){
		console.log("Invalid Input!", e);
		clearFoodBanks("Invalid Input!");

	}
}

const fetchFoodBanks = async(lat, long) => {
	try{
		const res2 = await axios.get(`https://api.alpha.ca.gov/FoodBanks?lat=${lat}&lon=${long}`, lat, long);
		getFoodBanks(res2.data);

	}catch(e){
		console.log("Unable to process the request at this moment", e);
		clearFoodBanks("Unable to process the request at this moment");
	}
}

const getFoodBanks = (foodBanksData) => {
	for(let foodBank of foodBanksData){
		const name = foodBank.properties.title;
		const distance = foodBank.properties.distance;
		const website = foodBank.properties.website;
		const address = foodBank.properties.address;
		const city = foodBank.properties.city;
		const info = name + "\n" + distance + "\n" + website + "\n" + address + ", " + city;
		console.log(info);
		addFoodBanks(info);
	}
}

const addFoodBanks = (info) => {
	const newLI = document.createElement('LI');
	newLI.append(info);
	foodBanksList.append(newLI);
}

const clearFoodBanks = (message) => {
	// As long as <ul> has a child node, remove it
	while (foodBanksList.hasChildNodes()) {  
 		foodBanksList.removeChild(foodBanksList.firstChild);
	}
	if(message != ""){
		const errorMessage = document.createElement('p');
		errorMessage.append(message);
		output.append(errorMessage);

	}
}

button.addEventListener('click', function(e){
	e.preventDefault();
	// clear foodBanksList
	clearFoodBanks("");
	//obtain the food banks
	fetchCoordinates();
});

