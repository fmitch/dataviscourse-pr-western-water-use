import numpy as np

def writePrecip(in_file, out_file):

    years = [1985, 1990, 1995, 2000, 2005, 2010, 2015]
    all_data = np.loadtxt(in_file)
    data = []
    for line in all_data:
        header = str(int(line[0]))
        county = int(header[2:5])
        year = int(header[-4:])
        if year in years:
            data.append([ county, year, line[1:].sum()] )
    np.savetxt(out_file, data, delimiter=',', header='county,year,precip', comments='', fmt='%i,%i,%.2f')

def writeTemp(in_file, out_file):

    years = [1985, 1990, 1995, 2000, 2005, 2010, 2015]
    all_data = np.loadtxt(in_file)
    data = []
    for line in all_data:
        header = str(int(line[0]))
        county = int(header[2:5])
        year = int(header[-4:])
        if year in years:
            data.append([ county, year, line[1:].mean()] )
    np.savetxt(out_file, data, delimiter=',', header='county,year,temp', comments='', fmt='%i,%i,%.2f')

states = ['utah']
for state in states:
    writeTemp('raw/climdiv-tmpccy-v1.0.0-20201005_'+state+'.txt', state+'/temp.csv')
    writePrecip('raw/climdiv-pcpncy-v1.0.0-20201005_'+state+'.txt', state+'/precip.csv')
