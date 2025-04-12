# prepare_profile_features.py
import json
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# Load profiles from JSON file
with open("profiles.json", "r") as f:
    data = json.load(f)

mentors = data.get("mentors", [])
mentees = data.get("mentees", [])

# Function to combine relevant text fields into one summary for mentors and mentees
def combine_profile_text(profile, role):
    if role == "mentor":
        # Combine mentor details
        expertise = profile.get("expertise", "")
        skills = " ".join(profile.get("skills", []))
        bio = profile.get("bio", "")
        availability = profile.get("availability", "")
        return f"{expertise} {skills} {bio} {availability}"
    elif role == "mentee":
        interests = " ".join(profile.get("interests", []))
        goals = profile.get("goals", "")
        return f"{interests} {goals}"
    return ""

# Create combined text for each mentor
mentor_texts = [combine_profile_text(m, "mentor") for m in mentors]
# Create combined text for each mentee
mentee_texts = [combine_profile_text(mn, "mentee") for mn in mentees]

print("Sample mentor text:", mentor_texts[0] if mentor_texts else "None")
print("Sample mentee text:", mentee_texts[0] if mentee_texts else "None")

# Initialize TF-IDF vectorizer (you may adjust parameters)
vectorizer = TfidfVectorizer(stop_words='english')

# Fit the vectorizer on combined mentor texts
if mentor_texts:
    mentor_features = vectorizer.fit_transform(mentor_texts)
    # For demonstration, print the feature vector shape
    print("Mentor feature matrix shape:", mentor_features.shape)
else:
    print("No mentor data available.")

# Optionally, create features for mentees similarly
if mentee_texts:
    mentee_features = vectorizer.transform(mentee_texts)  # use same vectorizer
    print("Mentee feature matrix shape:", mentee_features.shape)
else:
    print("No mentee data available.")

# Now, you can compute similarity between a given mentee and all mentors
# For example, for the first mentee:
if mentee_texts and mentor_texts:
    from sklearn.metrics.pairwise import cosine_similarity

    mentee_vector = vectorizer.transform([mentee_texts[0]])
    similarities = cosine_similarity(mentee_vector, mentor_features).flatten()
    print("Similarity scores for first mentee:", similarities)

    # Sort mentors based on similarity scores (highest first)
    sorted_indices = np.argsort(similarities)[::-1]
    top_n = 2  # Recommend top 2 mentors
    recommended_mentors = [mentors[i] for i in sorted_indices[:top_n]]
    for mentor, score in zip(recommended_mentors, similarities[sorted_indices][:top_n]):
        print(f"Recommended Mentor: {mentor['name']} with similarity score {score:.2f}")
