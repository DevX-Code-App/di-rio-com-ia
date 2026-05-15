import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import { getEntries } from '../services/storageService';
import { exportToText, exportToJSON } from '../utils/export';

export const SettingsScreen: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportText = async () => {
    setIsExporting(true);
    try {
      const entries = await getEntries();
      
      if (entries.length === 0) {
        Alert.alert('Sem entradas', 'Você ainda não tem entradas para exportar.');
        return;
      }

      const text = exportToText(entries);
      
      Alert.alert(
        'Exportar Diário',
        'Como você deseja exportar suas entradas?',
        [
          {
            text: 'Compartilhar',
            onPress: async () => {
              try {
                await Share.share({ message: text });
              } catch (error) {
                console.error('Error sharing:', error);
              }
            },
          },
          {
            text: 'Copiar',
            onPress: async () => {
              await Clipboard.setStringAsync(text);
              Alert.alert('Copiado!', 'Seu diário foi copiado para a área de transferência.');
            },
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar suas entradas.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const entries = await getEntries();
      
      if (entries.length === 0) {
        Alert.alert('Sem entradas', 'Você ainda não tem entradas para exportar.');
        return;
      }

      const json = exportToJSON(entries);
      
      Alert.alert(
        'Exportar JSON',
        'Suas entradas serão copiadas no formato JSON.',
        [
          {
            text: 'Copiar',
            onPress: async () => {
              await Clipboard.setStringAsync(json);
              Alert.alert('Copiado!', 'JSON copiado para a área de transferência.');
            },
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar suas entradas.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAbout = () => {
    Alert.alert(
      'Sobre o App',
      'Diário Pessoal com IA\n\n' +
      'Um espaço seguro para suas reflexões diárias.\n\n' +
      '✨ Sugestões de reflexões com IA\n' +
      '🔥 Sistema de streaks motivacional\n' +
      '📊 Insights sobre seus sentimentos\n' +
      '🔒 Seus dados ficam apenas no seu dispositivo\n\n' +
      'Versão 1.0.0'
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exportar</Text>
        
        <TouchableOpacity 
          style={styles.option}
          onPress={handleExportText}
          disabled={isExporting}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="document-text" size={24} color="#2196F3" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Exportar como Texto</Text>
              <Text style={styles.optionDescription}>
                Exportar todas as entradas em formato texto
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#95A5A6" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.option}
          onPress={handleExportJSON}
          disabled={isExporting}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="code-slash" size={24} color="#9C27B0" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Exportar como JSON</Text>
              <Text style={styles.optionDescription}>
                Formato estruturado para backup
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#95A5A6" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        
        <TouchableOpacity style={styles.option} onPress={handleAbout}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="information-circle" size={24} color="#FF9800" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Sobre o App</Text>
              <Text style={styles.optionDescription}>
                Versão e informações do aplicativo
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#95A5A6" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Ionicons name="lock-closed" size={16} color="#95A5A6" />
        <Text style={styles.footerText}>
          Seus dados são armazenados apenas localmente no seu dispositivo
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingHorizontal: 40,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#95A5A6',
    textAlign: 'center',
    flex: 1,
  },
});
