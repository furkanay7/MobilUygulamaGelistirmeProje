import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RaporSayfasi = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Bugün Odaklanma Süresi</Text>
      <Text style={styles.baslik}>Tüm Zamanların Toplam Odaklanma Süresi</Text>
      <Text style={styles.baslik}>Toplam Dikkat Dağınıklığı Sayısı</Text>
      <Text style={styles.baslik}>Grafikler</Text>
    </View>
  )
}

export default RaporSayfasi

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
  },
  baslik:{
    fontSize:20,
    margin : 10
  }
})