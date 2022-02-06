


const zipCodeInput = document.querySelector('#zipCodeInput');
const foodBanksList = document.querySelector('#foodBanksList');
const button = document.querySelector('#zipCodeButton');

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
	}
}

const fetchFoodBanks = async(lat, long) => {
	try{
		const res2 = await axios.get(`https://api.alpha.ca.gov/FoodBanks?lat=${lat}&lon=${long}`, lat, long);
		getFoodBanks(res2.data);

	}catch(e){
		console.log("Unable to process the request at this moment", e);
	}
}

const getFoodBanks = (foodBanksList) => {
	for(let foodBank of foodBanksList){
		const name = foodBank.properties.title;
		const distance = foodBank.properties.distance;
		const website = foodBank.properties.website;
		const address = foodBank.properties.address;
		const city = foodBank.properties.city;
		console.log(name + " " + distance + "\n" + website + "\n" + address + ", " + city);
	}
}

const addFoodBanks = () => {
	const newLI = document.createElement('LI');
	newLI.append();
	foodBanksList.append(newLI);
}

button.addEventListener('click', function(e){
	e.preventDefault();
	fetchCoordinates();
});
// clear foodBanksList

