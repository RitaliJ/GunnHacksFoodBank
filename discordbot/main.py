import os
import discord
import requests
import json
import random

client = discord.Client()
helpMessage = """***List of Commands:***
**!foodBankHelp** - Provides a list of commands
**!foodBankWebsite** - Sends you a website link to check for food banks near you.
**!foodBankCounty** - Takes in a county and sends the address of food banks nearby or in that county. 
**!foodBankFunFacts** - Sends fun facts on food banks or information on hunger from DoSomething.org
"""


funFacts = ['"The term “food insecurity” means that a person doesn\'t know where or when they’ll find their next meal. In 2013, 49.1 million Americans lived in food insecure households, 33.3 million adults and 15.8 million children."',
"In 2013, 62% of food-insecure households participated in at least 1 out of the 3 major Federal food assistance programs.",
"100% of food banks responding to a Feeding America survey reported an increase in demand for emergency food assistance in 2008. Demand for emergency food assistance increased at a rate ranging from 28.6% to 37.7%. Run a food drive outside your supermarket to keep your local food bank supplied.", 
"In 2013, households that had higher rates of food insecurity than the national average included households with children (20%), especially households with children headed by single women (34%) or single men (23%).",
"Across the Feeding America network of over 63,000 agencies, 66% of pantries, 41% of kitchen programs, and 11% of shelter programs have no paid staff, relying entirely on volunteers.",
"Hunger in America exists for over 50 million people. That is 1 in 6 of the U.S. population – including more than 1 in 5 children.",
"According to Map the Meal Gap, in 2012, the top 5 states with the highest rate of food insecure children under 18 are New Mexico, the District of Columbia, Arizona, Oregon, and Georgia.", 
"Food bank network members of Feeding America supply food to more than 37 million Americans each year, including 14 million children and 3 million seniors.",
"34% of all households served by Feeding America have had to choose between paying for food and paying for medicine or medical care.",
"72% of food banks do not feel as though they are able to adequately meet the needs of their communities without adjusting the amount of food distributed.",
"There are roughly 15,083 food pantries in America as of 2015."]

#Source: https://www.cdss.ca.gov/food-banks
countyFoodBankDictionary = {"Alameda" : "7900 Edgewater Drive", "Alpine" : "4550 Business Drive", "Amador" : "12181 Airport Road", "Butte" : "2640 S. Fifth Avenue, Suite 7", "Calaveras" : "206 George Reed Drive", "Contra Costa" : "4010 Nelson Avenue", 
"Del Norte": "286 M Street Suite A", "El Dorado" : "4550 Business Drive", "Fresno" : "4010 E Amendola Dr", "Humboldt" : "307 West 14th Street", "Imperial" : "329 Applestill Road", "Inyo" : "137 East South Street", "Kern" : "5005 Business Park N", "Kings" : "1130 North 11th Avenue", "Lake" : "1896 Big Valley Road", "Los Angeles" : "1444 San Francisco Avenue or 1734 East 41st Street", "Madera" : "225 South Pine Street, Suite 101", "Marin" : "75 Digital Drive", "Mariposa" : "2000 West Olive", "Mendocino" : "910 North Franklin", "Merced" : "2000 West Olive", "Tulare" : "611 2nd St", "Mono" : "137 East South Street", "Monterey" : "353 W Rossi St", "Napa" : "2521 Old Sonoma Rd", "Nevada" : "310 Railroad Ave #100",
"Orange" : "8014 Marine Way or 11870 Monarch Street", "Placer" : "8284 Industrial Avenue", "Riverside" : "2950-B Jefferson Street", "Sacremento" : "3333 3rd Ave.", "San Benito" : "1133 San Felipe Road", "San Bernardino" : "696 S. Tippecanoe Avenue", "San Diego" : "9850 Distribution Avenue", "San Francisco" : "900 Pennsylvania Avenue", "San Joaquin" : "2736 North Teepee Dr, Suite C", "San Luis Obispo" : "1180 Kendall Rd", "San Mateo" : "750 Curtner Avenue", "Santa Barbara" : "4554 Hollister", "Santa Clara" : "750 Curtner Avenue", "Santa Cruz" : "800 Ohlone Parkway", "Shasta" : "100 Mercy Oaks Drive", "Solano" : "4010 Nelson Avenue", "Sonoma" : "3990 Brickway Blvd.", "Stanislaus" : "600 Janopaul Way", "Sutter" : "760 Stafford Way", "Tehama" : "20699 Walnut Street", "Trinity" : "9069 3rd Street", "Tuolumne" : "10590 State Hwy 88", "Ventura" : "4156 North Southbank Road", "Yolo" : "233 Harter Ave", "Yuba" : "760 Stafford Way"}

county = ["Alameda", "Alpine", "Amador", "Butte", "Calaveras", "Contra Costa", "Del Norte", "El Dorado", "Fresno", "Humboldt","Imperial", "Inyo", "Kern", "Kings", "Lake", "Los Angeles", "Madera", "Marin", "Mariposa", "Mendocino", "Merced", "Tulare", "Mono", "Monterey", "Napa", "Nevada", "Orange", "Placer", "Riverside", "Sacremento", "San Benito", "San Bernardino", "San Diego", "San Francisco", "San Joaquin", "San Luis Obispo", "San Mateo", "Santa Barbara", "Santa Clara", "Santa Cruz", "Shasta", "Solano", "Sonoma", "Stanislaus", "Sutter", "Tehama", "Trinity", "Tuolumne", "Ventura", "Yolo", "Yuba"]

def get_quote():
  response = requests.get("https://zenquotes.io/api/random")
  json_data = json.loads(response.text)
  quote = json_data[0]['q'] + " - " + json_data[0]['a']
  return(quote)

def get_funFacts():
  randnum = random.randint(0, 4)
  quote = "According to DoSomething.org: " + funFacts[randnum]
  return(quote)

def get_CountyFoodBanks(county):
  for x, y in countyFoodBankDictionary.items():
    if x == county:
      return y

@client.event
async def on_ready():
  print("YOU CAN LIVE TODAY PLEB. {0.user}".format(client))
 
@client.event
async def on_message(message):
  if message.author == client:
    return

  if message.content.startswith("!foodBankHelp"):
    await message.channel.send(helpMessage)

  if message.content.startswith("!foodBankWebsite"):
    await message.channel.send("https://cafoodbanks.herokuapp.com/")
  
  if message.content.startswith("!foodBankCounty"):
    if any(word in message.content for word in county):
      for countyFinder in county:
        if countyFinder in message.content:
          print('Keyword found')
          foodBankAddress = get_CountyFoodBanks(countyFinder)
          await message.channel.send(foodBankAddress)
    else:
      await message.channel.send("DNE")

  if message.content.startswith("!foodBankFunFacts"):
    quote = get_funFacts()
    await message.channel.send(quote)

client.run(os.environ['TOKEN'])
