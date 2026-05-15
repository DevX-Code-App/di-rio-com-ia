import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface WelcomeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={60} color="#2196F3" />
          </View>

          <Text style={styles.title}>Bem-vindo ao seu Diário Pessoal! 📔</Text>
          
          <Text style={styles.subtitle}>
            Um espaço privado para suas reflexões diárias
          </Text>

          <View style={styles.features}>
            <Feature
              icon="sparkles"
              title="Reflexões com IA"
              description="Receba sugestões diárias para suas reflexões"
            />
            <Feature
              icon="flame"
              title="Sistema de Streaks"
              description="Mantenha sua sequência escrevendo todos os dias"
            />
            <Feature
              icon="bar-chart"
              title="Insights Pessoais"
              description="Visualize padrões nos seus sentimentos"
            />
            <Feature
              icon="lock-closed"
              title="100% Privado"
              description="Seus dados ficam apenas no seu dispositivo"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Começar a Escrever</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const Feature: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <View style={styles.feature}>
      <Ionicons name={icon} size={24} color="#2196F3" />
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  features: {
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
