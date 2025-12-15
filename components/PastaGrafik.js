import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PieChart } from "react-native-gifted-charts";

const PastaGrafik = ({ pieData }) => {

    const pieKategori = () => {
        return (
          <View style={styles.pieKategoriContainer}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.pieKategoriItem}>
                <View>
                  <Text style={styles.yuzdeText}>%{item.yuzdeDegeri} </Text>
                </View>
                <Text style={styles.pieKategoriText}>{item.kategoriAdi}</Text>
              </View>
            ))}
          </View>
        );
      };

  return (
    <View style={styles.icContainer}>
                <Text style={styles.icBaslik}>Kategori Dağılımı</Text>
                  <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <PieChart
                      data={pieData}    
                      showText={true} 
                      textColor="black"        
                      strokeColor="black"       
                      strokeWidth={1}
                    />
                  </View>
                  {pieKategori()}
              
            </View>
  )
}

export default PastaGrafik

const styles = StyleSheet.create({
     icContainer: { 
    flexDirection: 'column',
    justifyContent: 'space-evenly', 
    marginBottom: 30,
    backgroundColor:'white',
    borderRadius: 16,
    padding: 15,
    width: '90%',
    borderWidth: 1, 
    borderColor: 'black',
    gap: 15,
  },
  icBaslik: { 
    fontSize: 14, 
    color: 'black', 
    textAlign: 'center',
  },
    pieKategoriContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    
  },
  pieKategoriItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding:10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black', 
  },
  pieKategoriText: {
    fontSize: 14,
    color: 'black',
  },
  yuzdeText: {
    color: 'black',
    fontSize: 14,
  },
  
})