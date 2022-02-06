
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
	//rename variables
	const newTH = document.createElement('TR');
	const newTDName = document.createElement('TH');
	newTDName.append("Name");
	newTH.append(newTDName);
	const newTDDistance = document.createElement('TH');
	newTDDistance.append("Distance (miles)");
	newTH.append(newTDDistance);
	foodBanksList.append(newTH);

	for(let foodBank of foodBanksData){
		//escape HTML charcters
		const name = foodBank.properties.title;
		//round it to 2 decimal places and append unit
		const distance = foodBank.properties.distance;
		// make it a link that is clicable in another tab
		const website = foodBank.properties.website;
		// can we open google map??? embedded and inline??
		const address = foodBank.properties.address;
		const city = foodBank.properties.city;
		const info = name + "\n" + distance + "\n" + website + "\n" + address + ", " + city;
		console.log(info);
		addFoodBanks(name, distance);
	}
}

const addFoodBanks = (name, distance) => {
	//rename variables
	//apply CSS styling 
	const newLI = document.createElement('TR');
	const newNameTD = document.createElement('TD');
	newNameTD.append(name);
	const newDistanceTD = document.createElement('TD');
	newDistanceTD.append(distance);
	newLI.append(newNameTD);
	newLI.append(newDistanceTD);
	// newLI.append(info);
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

