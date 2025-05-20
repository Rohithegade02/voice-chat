import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';

type CustomButtonProps = {
  title: string;
} & PressableProps;

export default function CustomButton({ title, ...props }: CustomButtonProps) {
  return (
    <Pressable {...props} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'royalblue',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
