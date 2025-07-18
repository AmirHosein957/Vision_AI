import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
import matplotlib.pyplot as plt
import numpy as np
import random


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")


num_classes = 10
num_epochs = 40  
batch_size = 64  
learning_rate = 0.001


cifar10_mean = (0.4914, 0.4822, 0.4465)
cifar10_std = (0.2470, 0.2435, 0.2616)


transform_train = transforms.Compose([
    transforms.RandomHorizontalFlip(), 
    transforms.RandomCrop(32, padding=4), 
    transforms.ToTensor(),
    transforms.Normalize(cifar10_mean, cifar10_std)
])

transform_test = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(cifar10_mean, cifar10_std)
])


train_dataset = torchvision.datasets.CIFAR10(root='./data', train=True, download=True, transform=transform_train) # <-- استفاده از transform_train
train_loader = DataLoader(dataset=train_dataset, batch_size=batch_size, shuffle=True)

test_dataset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=transform_test) # <-- استفاده از transform_test
test_loader = DataLoader(dataset=test_dataset, batch_size=batch_size, shuffle=False)


class CNN(nn.Module):
    def __init__(self, num_classes):
        super(CNN, self).__init__()
        
       
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32) 
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(kernel_size=2, stride=2)
        
        
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64) 
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(kernel_size=2, stride=2)

        self.conv3 = nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128) 
        self.relu3 = nn.ReLU()
        self.pool3 = nn.MaxPool2d(kernel_size=2, stride=2) 

        
        self.fc1 = nn.Linear(128 * 4 * 4, 512)
        self.relu_fc1 = nn.ReLU()
        self.dropout1 = nn.Dropout(0.5) 

        self.fc2 = nn.Linear(512, 256)
        self.relu_fc2 = nn.ReLU()
        self.dropout2 = nn.Dropout(0.5) 

        self.fc3 = nn.Linear(256, num_classes)
        
    def forward(self, x):
        x = self.pool1(self.relu1(self.bn1(self.conv1(x))))
        x = self.pool2(self.relu2(self.bn2(self.conv2(x))))
        x = self.pool3(self.relu3(self.bn3(self.conv3(x))))
        
        x = x.view(x.size(0), -1) 
        
       
        x = self.dropout1(self.relu_fc1(self.fc1(x)))
        x = self.dropout2(self.relu_fc2(self.fc2(x)))
        x = self.fc3(x)
        
        return x


model = CNN(num_classes).to(device)
print(model)


criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=learning_rate)


#print("\n  start learning Moudle")
#total_steps = len(train_loader)

#for epoch in range(num_epochs):
  #  model.train()
   # running_loss = 0.0
    #for i, (images, labels) in enumerate(train_loader):
     #   images = images.to(device)
      #  labels = labels.to(device)
#
 #       outputs = model(images)
  #      loss = criterion(outputs, labels)

   #     optimizer.zero_grad()
    #    loss.backward()
     #   optimizer.step()

      #  running_loss += loss.item()
#
 #       if (i + 1) % 100 == 0:
  #          print(f'Epoch [{epoch+1}/{num_epochs}], Step [{i+1}/{total_steps}], Loss: {running_loss / 100:.4f}')
   #         running_loss = 0.0

   
model.eval()
with torch.no_grad():
        correct = 0
        total = 0
        for images, labels in test_loader:
            images = images.to(device)
            labels = labels.to(device)
            outputs = model(images)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
        
        #accuracy = 100 * correct / total
        #print(f'Epoch [{epoch+1}/{num_epochs}] - Test Accuracy: {accuracy:.2f}%')

print("\n--- آموزش به پایان رسید ---")
classes = ('plane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck')
model.eval()
num_samples_to_display = 9
num_rows = 3
num_cols = 3

fig, axes = plt.subplots(num_rows, num_cols, figsize=(8, 8))
axes = axes.flatten()

print(f"\n--- Displaying {num_samples_to_display} random predictions from CIFAR-10 ---")

for i in range(num_samples_to_display):
    random_index = random.randint(0, len(test_dataset) - 1)
    sample_image, true_label_index = test_dataset[random_index] 

    input_image = sample_image.unsqueeze(0).to(device)

    with torch.no_grad():
        output_logits = model(input_image)
        _, predicted_label_index_tensor = torch.max(output_logits, 1) 
        predicted_label_index = predicted_label_index_tensor.item() 

    
    true_label_name = classes[true_label_index]
    predicted_label_name = classes[predicted_label_index]

    
    
    mean_np = np.array(cifar10_mean)
    std_np = np.array(cifar10_std)
    display_image = sample_image.cpu().numpy()
    display_image = display_image.transpose((1, 2, 0))
    display_image = display_image * std_np + mean_np
    display_image = np.clip(display_image, 0, 1)

    
    axes[i].imshow(display_image)
    axes[i].set_title(f"True: {true_label_name}\nPred: {predicted_label_name}", 
                      color="green" if predicted_label_name == true_label_name else "red")
    axes[i].axis('off')

plt.tight_layout()
plt.show()