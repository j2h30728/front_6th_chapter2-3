import { useGetUserById } from "@/feature/get-user-by-id"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"

import { useUserProfileModal } from "../model/useUserProfileModal"

export const UserProfileModal = () => {
  const { close, data: selectedUser, isOpen } = useUserProfileModal()
  const { data: userData } = useGetUserById(selectedUser?.id)

  return (
    <Dialog onOpenChange={close} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img alt={userData?.username} className="w-24 h-24 rounded-full mx-auto" src={userData?.image} />
          <h3 className="text-xl font-semibold text-center">{userData?.username}</h3>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {userData?.firstName} {userData?.lastName}
            </p>
            <p>
              <strong>나이:</strong> {userData?.age}
            </p>
            <p>
              <strong>이메일:</strong> {userData?.email}
            </p>
            <p>
              <strong>전화번호:</strong> {userData?.phone}
            </p>
            <p>
              <strong>주소:</strong> {userData?.address?.address}, {userData?.address?.city}, {userData?.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {userData?.company?.name} - {userData?.company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
