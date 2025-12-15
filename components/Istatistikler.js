import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Istatistikler = ({ stats }) => {
  return (
    <View style={styles.icContainer}>
          <View>
            <Text style={styles.icBaslik}>Bugün Toplam Odak</Text>
            <Text style={styles.icBaslik}>{stats.bugunToplam} dk</Text>
          </View>
          <View>
            <Text style={styles.icBaslik}>Genel Toplam Odak</Text>
            <Text style={styles.icBaslik}>{stats.genelToplam} dk</Text>
          </View>
          <View>
            <Text style={styles.icBaslik}>Bugün Dikkat Dağınıklığı</Text>
            <Text style={styles.icBaslik}>{stats.bugünToplamDikkat}</Text>
          </View>
          <View>
            <Text style={styles.icBaslik}>Genel Dikkat Dağınıklığı</Text>
            <Text style={styles.icBaslik}>{stats.genelToplamDikkat}</Text>
          </View>
        </View>
  )
}

export default Istatistikler

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
})