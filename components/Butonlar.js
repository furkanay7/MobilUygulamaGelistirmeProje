import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'

const Butonlar = ({ isActive, leftTimes, initialTimes, handleStart, handlePause, handleReset }) => {
  return (
    <View style={styles.buton}>
            <TouchableOpacity style={styles.butonTas} onPress={handleReset}>
              <Text style={styles.butonText}>Sıfırla</Text>
            </TouchableOpacity>
            {!isActive ? (
              <TouchableOpacity style={styles.butonTas} onPress={handleStart}>
                <Text style={styles.butonText}>
                  {leftTimes === initialTimes * 60 ? "Başlat" : "Devam"} </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.butonTas} onPress={handlePause}>
                <Text style={styles.butonText}>Duraklat</Text>
              </TouchableOpacity>
            )}
    
           
            
          </View>
  )
}

export default Butonlar

const styles = StyleSheet.create({
    buton:{
    width:'100%',
    flexDirection:'row',
    justifyContent: 'space-evenly',
    alignItems:'center',
  },
  butonTas: {
    width:80,
    height:80,
    borderWidth:2,
    borderRadius:20,
    justifyContent:'center',
    backgroundColor: 'white',
    alignItems:'center'
  },
  butonText:{
  }
})