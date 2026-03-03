import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabase";
import { registerForPushNotificationsAsync } from "../helpers/notificationHelper";
import axios from "axios";
import { API_URL } from "../constants/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Fetch user profile if needed, or just set generic data
        // For now we'll rely on session user metadata if available
        // or keep userData null to trigger profile completion flow if strict
        checkUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      setSession(session);
      if (session) {
        checkUserProfile(session.user.id);
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          handleRegisterToken(session);
        }
      } else {
        setUserData();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRegisterToken = async (session) => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token && session) {
        await axios.put(`${API_URL}/api/notifications/token`,
          { pushToken: token },
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        );
        console.log("Push token registered successfully");
      }
    } catch (error) {
      console.log("Error registering push token:", error);
    }
  };

  const checkUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "No rows found"
        console.log("Error fetching user profile:", error.message);
        return;
      }

      if (data) {
        // Map DB columns to app state structure if needed, or use direct
        setUserData({
          ...data,
          name: data?.full_name, // app uses 'name', db uses 'full_name'
        });
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.log("Unexpected error fetching profile:", error);
    }
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    if (error) {
      console.log("Sign In Error:", error.message);
      throw error;
    }
    return true;
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          role: "customer",
        },
      },
    });
    if (error) {
      console.log("Sign Up Error:", error.message);
      throw error;
    }
    return data; // Return full data to check session/user
  };

  const completeProfile = async (profileData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    const updates = {
      id: user.id,
      full_name: profileData.name,
      phone: profileData.phone,
      email: profileData.email,
      gender: profileData.gender,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("users").upsert(updates);

    if (error) {
      console.log("Profile Update Error:", error.message);
      throw error;
    }

    setUserData((prev) => ({
      ...prev,
      ...profileData,
      full_name: profileData.name,
    }));
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Sign Out Error:", error.message);
    // State updates handled by onAuthStateChange
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        userData,
        loading,
        signIn,
        signUp,
        completeProfile,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
