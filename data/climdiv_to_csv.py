import numpy as np
import os

stateCodes = {
    'alabama' :               '01','new jersey'      :'28',   
    'arizona' :               '02','new mexico'      :'29',    
    'arkansas' :              '03','new york'        :'30',             
    'california' :            '04','north carolina'  :'31',   
    'colorado' :              '05','north dakota'    :'32', 
    'connecticut' :           '06','ohio'            :'33',    
    'delaware' :              '07','oklahoma'        :'34',  
    'florida' :               '08','oregon'          :'35', 
    'georgia' :               '09','pennsylvania'    :'36',
    'idaho' :                 '10','rhode island'    :'37',
    'illinois' :              '11','south carolina'  :'38',      
    'indiana' :               '12','south dakota'    :'39',    
    'iowa' :                  '13','tennessee'       :'40', 
    'kansas' :                '14','texas'           :'41',   
    'kentucky' :              '15','utah'            :'42',   
    'louisiana' :             '16','vermont'         :'43',    
    'maine' :                 '17','virginia'        :'44',   
    'maryland' :              '18','washington'      :'45',
    'massachusetts' :         '19','west virginia'   :'46',
    'michigan' :              '20','wisconsin'       :'47',
    'minnesota' :             '21','wyoming'         :'48',
    'mississippi' :           '22', 
    'missouri' :              '23', 
    'montana' :               '24', 
    'nebraska' :              '25', 
    'nevada' :                '26', 
    'new hampshire' :         '27', } 

all_precip_data = np.loadtxt('raw/climdiv-pcpncy-v1.0.0-20201005')
all_temp_data = np.loadtxt('raw/climdiv-tmpccy-v1.0.0-20201005')

def writePrecip(code, out_file):

    years = [1985, 1990, 1995, 2000, 2005, 2010, 2015]
    data = []
    for line in all_precip_data:
        header = str(int(line[0]))
        state_code = header[-11:-9]
        county = int(header[-9:-6])
        year = int(header[-4:])
        if year in years and int(state_code) == int(code):
            data.append([ county, year, line[1:].sum()] )
    np.savetxt(out_file, data, delimiter=',', header='county,year,precip', comments='', fmt='%i,%i,%.2f')
def writeTemp(code, out_file):

    years = [1985, 1990, 1995, 2000, 2005, 2010, 2015]
    data = []
    for line in all_temp_data:
        header = str(int(line[0]))
        state_code = header[-11:-9]
        county = int(header[-9:-6])
        year = int(header[-4:])
        if year in years and int(state_code) == int(code):
            data.append([ county, year, line[1:].mean()] )
    np.savetxt(out_file, data, delimiter=',', header='county,year,temp', comments='', fmt='%i,%i,%.2f')

for state, code in zip(stateCodes.keys(), stateCodes.values()):
    if not os.path.exists(state):
        os.mkdir(state)
    writeTemp(code, state+'/temp.csv')
    print('temp', state)
    writePrecip(code, state+'/precip.csv')
    print('precip', state)
