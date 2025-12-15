import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'

const Sayac = ({ leftTimes, isActive, changeTime }) => {
    const timerRef = useRef(null);

    const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startChanging = (amount) => {
      if (isActive) return; 
      changeTime(amount); 
      timerRef.current = setInterval(() => {
        changeTime(amount);
      }, 100);
    };
  
    const stopChanging = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

  return (
    <View style={styles.zaman}> 
            <TouchableOpacity 
              style={styles.butonZaman} 
              onPressIn={() => startChanging(-1)} 
              onPressOut={stopChanging}
            >
              <Text style={styles.zamanText}>-1</Text>
            </TouchableOpacity>
    
          <View style={styles.sayac}>
          <Text style={styles.sayacText}>{formatTime(leftTimes)}</Text>
          </View>
            
           <TouchableOpacity 
              style={styles.butonZaman} 
              onPressIn={() => startChanging(+1)} 
              onPressOut={stopChanging}
            >
              <Text style={styles.zamanText}>+1</Text>
            </TouchableOpacity>
          </View>
  )
}

export default Sayac

const styles = StyleSheet.create({
    zaman:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
    margin:90,
  }, 
  butonZaman:{
    width:60,
    height:60,
    borderWidth:2,
    borderRadius:50,
    justifyContent:'center',
    backgroundColor: 'white',
    alignItems:'center'
  }, 
  zamanText:{
    fontSize:20
  },
  sayac:{
    width:200,
    height:100,
    borderWidth:3,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white',
  },
  sayacText:{
    fontSize:65
  },
})