#!/usr/bin/python
'''
    Script to convert the HTML results of pdftohtml on a one-table, multiple page PDF focument 
    into a CSV file of individual county records as well as a JSON file continaing the sum of
    county populations for a given year.

    Primarily used in processing pdf at 
    http://www.library.umaine.edu/govdoc/Census%20Population%201790%202000.pdf
'''

import sys, csv, json
from HTMLParser import HTMLParser as Parse

#Quick and dirty way to strip HTML tags from data
class Parser(Parse):
    def __init__(self):
        self.reset()
        self.fed = []

    def handle_data(self, d):
        self.fed.append(d)

    def get_data(self):
        return "".join(self.fed)

#Get the system input
if len(sys.argv) is 4:
    text = open(sys.argv[1], "r").read()
    output_file = sys.argv[2].split(".")[0]
    lines = int(sys.argv[3])
else:
    print "Three arguments required: input file, output file and line numbers to concatenate"
    sys.exit()

#strip html tags and build list of one line per list element
s = Parser()
s.feed(text)
textData = [x for x in s.get_data().split("\n") if x is not ""]

#create list from four line chunks of original list
#in the format Place, Year, County, Population
data = [textData[i:i+lines] for i in range(0, len(textData), lines)]

#write to file specified in csv format
output_file += ".csv"
output = open(output_file, "wb")
writer = csv.writer(output)
writer.writerows(data)
output.close()

#Build dictionary with sum of county population for the census year
yearData = {"comment" : "Data file with the sum of all county populations for the given census year"}

#iterate over each row in the data and construct the dict in the format
#yearData[year][county] = sum of population of all towns/cities in county
for row in data[4:]:

    #year is not in dict, so add the row's county and population
    if row[1] not in yearData:
        yearData[row[1]] = {row[2] : int(row[3])} 
    else:

        #county is not in dict for this year, so add and initialize population value
        if row[2] not in yearData[row[1]]:
            yearData[row[1]][row[2]] = int(row[3]) 

        #county exists in this year, so add population to current
        else:
            yearData[row[1]][row[2]] += int(row[3]) 

#construct output filename, replacing original output with .json & open connection
json_file = sys.argv[2].split(".")[0] + ".json"
json_output = open(json_file, "wb")

#print output to file and close file connections
print >> json_output, json.dumps(yearData, indent = 4)
json_output.close()