'use client';

import AuthWrapper from "@/components/AuthWrapper";
import FullScreenContainer from "@/components/FullScreenContainer";
import Header from "@/components/Header";
import Board from "@/components/Board";
import { ReduxProvider } from "@/providers/ReduxProvider";

// Home page component
export default function Home() {
  return (
    <div>
      <ReduxProvider>
        <AuthWrapper>
          <FullScreenContainer>
            <Header></Header>
            <Board></Board>
          </FullScreenContainer>
        </AuthWrapper>
      </ReduxProvider>
    </div>
  );
}
