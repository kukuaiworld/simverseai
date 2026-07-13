import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# Set aesthetic style for visualizations
sns.set_theme(style="whitegrid")
plt.rcParams.update({
    'font.size': 11,
    'axes.labelsize': 12,
    'axes.titlesize': 14,
    'xtick.labelsize': 10,
    'ytick.labelsize': 10,
    'figure.titlesize': 16
})

# Create directory for visualizations
os.makedirs("visualizations", exist_ok=True)

# =====================================================================
# STEP 1: DATA GENERATION
# =====================================================================
print("--- Step 1: Generating Dataset ---")
np.random.seed(42)
n_samples = 1000

# Continuous variables
patient_ids = np.arange(1, n_samples + 1)
age = np.random.randint(18, 85, size=n_samples)
gender = np.random.choice(['Male', 'Female', 'Other'], size=n_samples, p=[0.48, 0.48, 0.04])

# BMI modeled as right-skewed lognormal
bmi = 15.0 + np.random.lognormal(mean=2.3, sigma=0.3, size=n_samples)

# Smoking status
smoking_status = np.random.choice(['Non-smoker', 'Former', 'Current'], size=n_samples, p=[0.55, 0.25, 0.20])
smoking_numeric = np.select(
    [smoking_status == 'Non-smoker', smoking_status == 'Former', smoking_status == 'Current'],
    [0.0, 0.5, 1.0]
)

# BP and Cholesterol modeled with dependencies
systolic_bp = 100.0 + 0.4 * age + 0.8 * bmi + 6.0 * smoking_numeric + np.random.normal(0, 8, size=n_samples)
diastolic_bp = 60.0 + 0.25 * age + 0.5 * bmi + 3.0 * smoking_numeric + np.random.normal(0, 6, size=n_samples)
cholesterol = 140.0 + 1.1 * age + 1.6 * bmi + 10.0 * smoking_numeric + np.random.normal(0, 20, size=n_samples)

# Exercise Hours per week (negatively correlated with age and BMI)
exercise_hours = 12.0 - 0.05 * age - 0.15 * bmi + np.random.normal(0, 2.0, size=n_samples)
exercise_hours = np.clip(exercise_hours, 0.0, 25.0)

# Logistic models for disease outcomes
# 1. Diabetes Probability
z_diabetes = -6.5 + 0.04 * age + 0.12 * bmi - 0.15 * exercise_hours
prob_diabetes = 1.0 / (1.0 + np.exp(-z_diabetes))
diabetic = np.random.binomial(1, prob_diabetes)

# 2. Heart Disease Probability
z_heart = -9.0 + 0.055 * age + 0.02 * systolic_bp + 0.008 * cholesterol + 1.2 * smoking_numeric - 0.1 * exercise_hours
prob_heart = 1.0 / (1.0 + np.exp(-z_heart))
heart_disease = np.random.binomial(1, prob_heart)

# Create DataFrame
df = pd.DataFrame({
    'Patient_ID': patient_ids,
    'Age': age,
    'Gender': gender,
    'BMI': bmi,
    'Systolic_BP': systolic_bp,
    'Diastolic_BP': diastolic_bp,
    'Cholesterol': cholesterol,
    'Exercise_Hours_Wk': exercise_hours,
    'Smoking_Status': smoking_status,
    'Diabetic': diabetic,
    'Heart_Disease': heart_disease
})

# Inject missing values (to demonstrate cleaning)
# BMI: 25 missing values, Cholesterol: 30 missing values
df.loc[df.sample(25, random_state=12).index, 'BMI'] = np.nan
df.loc[df.sample(30, random_state=34).index, 'Cholesterol'] = np.nan

# Inject extreme outliers
# Extreme BMI outliers
df.loc[df.sample(3, random_state=56).index, 'BMI'] = 82.5
# Extreme cholesterol outliers
df.loc[df.sample(3, random_state=78).index, 'Cholesterol'] = 620.0

# Add duplicates (10 duplicate rows)
duplicates = df.sample(10, random_state=99)
df = pd.concat([df, duplicates], ignore_index=True)

# Save raw dataset
df.to_csv("health_dataset.csv", index=False)
print(f"Dataset generated and saved to health_dataset.csv (Shape: {df.shape})")

# =====================================================================
# STEP 2: DATA CLEANING
# =====================================================================
print("\n--- Step 2: Data Cleaning ---")
cleaned_report = []

# Duplicate records detection and removal
num_duplicates = df.duplicated().sum()
cleaned_report.append(f"Detected duplicate records: {num_duplicates}")
df_clean = df.drop_duplicates().copy()
cleaned_report.append(f"Shape after removing duplicates: {df_clean.shape}")

# Missing value detection
missing_info = df_clean.isnull().sum()
cleaned_report.append("\nMissing values before imputation:")
for col, val in missing_info.items():
    if val > 0:
        cleaned_report.append(f"  - {col}: {val} missing values")

# Impute missing values with median
bmi_median = df_clean['BMI'].median()
chol_median = df_clean['Cholesterol'].median()
df_clean['BMI'] = df_clean['BMI'].fillna(bmi_median)
df_clean['Cholesterol'] = df_clean['Cholesterol'].fillna(chol_median)
cleaned_report.append(f"Imputed missing BMI with median ({bmi_median:.1f})")
cleaned_report.append(f"Imputed missing Cholesterol with median ({chol_median:.1f})")

# Outlier Detection (using IQR method)
continuous_cols = ['Age', 'BMI', 'Systolic_BP', 'Diastolic_BP', 'Cholesterol', 'Exercise_Hours_Wk']
outlier_details = []
for col in continuous_cols:
    Q1 = df_clean[col].quantile(0.25)
    Q3 = df_clean[col].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    outliers = df_clean[(df_clean[col] < lower_bound) | (df_clean[col] > upper_bound)]
    outlier_details.append(f"  - {col}: {len(outliers)} outliers detected (IQR bounds: [{lower_bound:.1f}, {upper_bound:.1f}])")

cleaned_report.append("\nOutlier Detection (using IQR method):")
cleaned_report.extend(outlier_details)

# Clip extreme outliers (to handle clinical anomalies)
df_clean['BMI'] = df_clean['BMI'].clip(lower=12.0, upper=60.0)
df_clean['Cholesterol'] = df_clean['Cholesterol'].clip(lower=100.0, upper=450.0)
cleaned_report.append("Clipped extreme BMI outliers to [12.0, 60.0] and Cholesterol to [100.0, 450.0]")

# Save cleaned dataset
df_clean.to_csv("health_dataset_cleaned.csv", index=False)
print("Data cleaning completed and saved to health_dataset_cleaned.csv")

# Save cleaning log to file
with open("visualizations/cleaning_log.txt", "w") as f:
    f.write("\n".join(cleaned_report))

# =====================================================================
# STEP 3: STATISTICAL SUMMARIES
# =====================================================================
print("\n--- Step 3: Statistical Summaries ---")

# Descriptive statistics for continuous variables
desc_stats = df_clean[continuous_cols].describe().T
desc_stats['variance'] = df_clean[continuous_cols].var()
desc_stats['skewness'] = df_clean[continuous_cols].skew()
desc_stats = desc_stats[['mean', '50%', 'std', 'variance', 'skewness', 'min', 'max']]
desc_stats.rename(columns={'50%': 'median'}, inplace=True)
desc_stats.to_csv("visualizations/descriptive_statistics.csv")

# Categorical summaries
cat_cols = ['Gender', 'Smoking_Status', 'Diabetic', 'Heart_Disease']
with open("visualizations/categorical_summaries.txt", "w") as f:
    for col in cat_cols:
        counts = df_clean[col].value_counts()
        pcts = df_clean[col].value_counts(normalize=True) * 100
        summary_df = pd.DataFrame({'Count': counts, 'Percentage (%)': pcts})
        f.write(f"=== Frequency Table for: {col} ===\n")
        f.write(summary_df.to_string())
        f.write("\n\n")

# =====================================================================
# STEP 4: VISUAL EXPLORATIONS
# =====================================================================
print("\n--- Step 4: Generating Visualizations ---")

# 1. Distributions: Histograms and Boxplots for BMI, BP, Cholesterol
fig, axes = plt.subplots(3, 2, figsize=(14, 15))
vars_to_plot = [
    ('BMI', 'BMI Distribution', '#4f46e5'),
    ('Systolic_BP', 'Systolic Blood Pressure (mmHg)', '#0891b2'),
    ('Cholesterol', 'Serum Cholesterol (mg/dL)', '#db2777')
]

for idx, (col, title, color) in enumerate(vars_to_plot):
    # Histogram
    sns.histplot(df_clean[col], kde=True, ax=axes[idx, 0], color=color)
    axes[idx, 0].set_title(f"Histogram of {title}")
    axes[idx, 0].set_xlabel(col)
    
    # Boxplot
    sns.boxplot(x=df_clean[col], ax=axes[idx, 1], color=color, width=0.4)
    axes[idx, 1].set_title(f"Boxplot of {title}")
    axes[idx, 1].set_xlabel(col)

plt.suptitle("Distributions and Boxplots: BMI, BP, and Cholesterol", y=0.98)
plt.tight_layout()
plt.savefig("visualizations/distributions.png", dpi=150)
plt.close()

# 2. Scatterplots: BMI vs Systolic BP, Cholesterol vs Age
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

sns.scatterplot(data=df_clean, x='BMI', y='Systolic_BP', hue='Heart_Disease', palette={0: '#3b82f6', 1: '#ef4444'}, alpha=0.7, ax=ax1)
# Add regression line
sns.regplot(data=df_clean, x='BMI', y='Systolic_BP', scatter=False, ax=ax1, color='#1e293b', line_kws={"linestyle": "--"})
ax1.set_title("BMI vs Systolic Blood Pressure")
ax1.set_xlabel("BMI ($kg/m^2$)")
ax1.set_ylabel("Systolic Blood Pressure (mmHg)")

sns.scatterplot(data=df_clean, x='Age', y='Cholesterol', hue='Diabetic', palette={0: '#10b981', 1: '#f59e0b'}, alpha=0.7, ax=ax2)
sns.regplot(data=df_clean, x='Age', y='Cholesterol', scatter=False, ax=ax2, color='#1e293b', line_kws={"linestyle": "--"})
ax2.set_title("Age vs Serum Cholesterol")
ax2.set_xlabel("Age (Years)")
ax2.set_ylabel("Serum Cholesterol (mg/dL)")

plt.suptitle("Bivariate Analyses with Risk Outcomes", y=0.98)
plt.tight_layout()
plt.savefig("visualizations/scatterplots.png", dpi=150)
plt.close()

# 3. Correlation Heatmap (Pearson and Spearman)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 7))

pearson_corr = df_clean[continuous_cols].corr(method='pearson')
spearman_corr = df_clean[continuous_cols].corr(method='spearman')

sns.heatmap(pearson_corr, annot=True, cmap="coolwarm", vmin=-1, vmax=1, fmt=".3f", ax=ax1, cbar_kws={'label': 'Coefficient'})
ax1.set_title("Pearson Linear Correlation")

sns.heatmap(spearman_corr, annot=True, cmap="coolwarm", vmin=-1, vmax=1, fmt=".3f", ax=ax2, cbar_kws={'label': 'Coefficient'})
ax2.set_title("Spearman Rank Correlation")

plt.suptitle("Correlation Matrices among Continuous Metrics", y=0.98)
plt.tight_layout()
plt.savefig("visualizations/correlation_heatmap.png", dpi=150)
plt.close()

# Save correlation matrix to CSV
pearson_corr.to_csv("visualizations/pearson_correlation.csv")
spearman_corr.to_csv("visualizations/spearman_correlation.csv")

# 4. Categorical variables bar charts: Smoking Status vs disease incidence
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

# Grouping by Smoking Status
smoking_diab = df_clean.groupby('Smoking_Status')['Diabetic'].mean() * 100
smoking_heart = df_clean.groupby('Smoking_Status')['Heart_Disease'].mean() * 100

# Convert to dataframe for plotting
smoke_df = pd.DataFrame({
    'Smoking Status': smoking_diab.index,
    'Diabetes Prevalence (%)': smoking_diab.values,
    'Heart Disease Prevalence (%)': smoking_heart.values
})

# Reorder
smoke_df['Smoking Status'] = pd.Categorical(smoke_df['Smoking Status'], categories=['Non-smoker', 'Former', 'Current'], ordered=True)
smoke_df = smoke_df.sort_values('Smoking Status')

sns.barplot(data=smoke_df, x='Smoking Status', y='Diabetes Prevalence (%)', hue='Smoking Status', palette="Blues_d", legend=False, ax=ax1)
ax1.set_title("Diabetes Incidence by Smoking Status")
ax1.set_ylabel("Prevalence (%)")
for p in ax1.patches:
    ax1.annotate(f"{p.get_height():.1f}%", (p.get_x() + p.get_width() / 2., p.get_height() + 0.5),
                ha='center', va='center', xytext=(0, 5), textcoords='offset points')

sns.barplot(data=smoke_df, x='Smoking Status', y='Heart Disease Prevalence (%)', hue='Smoking Status', palette="Reds_d", legend=False, ax=ax2)
ax2.set_title("Heart Disease Incidence by Smoking Status")
ax2.set_ylabel("Prevalence (%)")
for p in ax2.patches:
    ax2.annotate(f"{p.get_height():.1f}%", (p.get_x() + p.get_width() / 2., p.get_height() + 0.5),
                ha='center', va='center', xytext=(0, 5), textcoords='offset points')

plt.suptitle("Disease Prevalence by Smoking Behaviors", y=0.98)
plt.tight_layout()
plt.savefig("visualizations/categorical_associations.png", dpi=150)
plt.close()

# =====================================================================
# STEP 5: CORRELATION & INFLUENCING FACTORS (REGRESSION / FEATURE IMPORTANCE)
# =====================================================================
print("\n--- Step 5: Correlation & Influencing Factors ---")

# Let's perform a standardized logistic regression for Diabetic and Heart_Disease
# to identify standardized coefficients (which act as feature importances).
features_diab = ['Age', 'BMI', 'Exercise_Hours_Wk']
X_diab = df_clean[features_diab]
y_diab = df_clean['Diabetic']

scaler = StandardScaler()
X_diab_scaled = scaler.fit_transform(X_diab)

model_diab = LogisticRegression()
model_diab.fit(X_diab_scaled, y_diab)

importance_diab = pd.DataFrame({
    'Feature': features_diab,
    'Standardized Coeff (Beta)': model_diab.coef_[0],
    'Odds Ratio (scaled)': np.exp(model_diab.coef_[0])
}).sort_values('Standardized Coeff (Beta)', key=abs, ascending=False)

importance_diab.to_csv("visualizations/diabetes_influencers.csv", index=False)

# Heart disease logistic regression
features_heart = ['Age', 'BMI', 'Systolic_BP', 'Cholesterol', 'Exercise_Hours_Wk']
# encode smoking status as one-hot
df_encoded = pd.get_dummies(df_clean, columns=['Smoking_Status'], drop_first=True)
# Smoking_Status_Former and Smoking_Status_Current
smoke_cols = [c for c in df_encoded.columns if 'Smoking_Status' in c]
features_heart.extend(smoke_cols)

X_heart = df_encoded[features_heart].astype(float)
y_heart = df_encoded['Heart_Disease']

X_heart_scaled = scaler.fit_transform(X_heart)
model_heart = LogisticRegression()
model_heart.fit(X_heart_scaled, y_heart)

importance_heart = pd.DataFrame({
    'Feature': features_heart,
    'Standardized Coeff (Beta)': model_heart.coef_[0],
    'Odds Ratio (scaled)': np.exp(model_heart.coef_[0])
}).sort_values('Standardized Coeff (Beta)', key=abs, ascending=False)

importance_heart.to_csv("visualizations/heart_disease_influencers.csv", index=False)

print("Standardized regression coefficients computed and saved.")
print("Exploratory Data Analysis execution completed successfully!")
