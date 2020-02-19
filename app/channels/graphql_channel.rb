class GraphqlChannel < ApplicationCable::Channel
  def subscribed
    @subscription_ids = []
  end

  def execute(data)
    result = execute_query(data)
    payload = {
      result: result.subscription? ? { data: nil } : result.to_h,
      more: result.subscription?
    }

    @subscription_ids << context[:subscription_id] if result.context[:subscription_id]

    transmit(payload) 
  end

  def unsubscribed
    @subscription_ids.each do |sid|
      SwyleSchema.subscriptions.delete_subscription(sid)
    end
  end

   private

  def execute_query(data)
    
    SwyleSchema.execute(
      query: data["query"],
      context: context,
      variables: data["variables"],
      operation_name: data["operationName"]
    )
  end

  def context
    id = current_user ? current_user.id : 1
     puts context[:current_user]
    {
      current_user_id: id,
      current_user: context[:current_user],
      channel: self
    }
  end
end
