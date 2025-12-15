import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'

const Kategori = ({ items, value, setValue }) => {
  return (
    <View style={styles.kategori}>
          <Text style={styles.kategoriText}>Kategori</Text>
          
            <View style={styles.scroll}>
        <ScrollView 
          showsVerticalScrollIndicator={true} 
          contentContainerStyle={styles.listContainer}
          nestedScrollEnabled={true} 
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => setValue(item.value)}
              style={[
                styles.listItem,
                value === item.value && styles.seciliListItem
              ]}
            >
              <Text style={[
                styles.listItemText,
                value === item.value && styles.seciliListItemText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
          </View>
  )
}

export default Kategori

const styles = StyleSheet.create({
    kategori:{
    width:'60%',
    alignItems:'center',
  },
  scroll: {
    width: '100%',      
    height: 130,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'black',
    overflow: 'hidden'
  },
  listItem: {
    width: '100%',    
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center', 
  },
  seciliListItem: { 
    borderColor: 'black',
  },
  listItemText: {
    fontSize: 12,
  },
  seciliListItemText: {
    fontWeight: 'bold',
  },
  kategoriText: {
    fontSize: 25, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: 'black', 
  }
})